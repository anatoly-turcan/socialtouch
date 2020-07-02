const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const catchError = require('../utils/catchError');
const validate = require('../utils/validate');
const userConstraints = require('../validators/userConstraints');
const User = require('../entities/userSchema');
const UserModel = require('../models/userModel');

const signToken = (id, salt) => {
  return jwt.sign({ id }, process.env.JWT_SECRET + salt, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id, user.salt);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(statusCode).json({
    status: 'success',
    data: {
      user: {
        username: user.username,
        link: user.link,
        img: user.img_id || undefined,
      },
    },
  });
};

exports.signup = catchError(async ({ connection, body }, res, next) => {
  const user = new UserModel(
    body.username,
    body.email,
    body.password,
    body.passwordConfirm
  );

  const validation = validate(user, userConstraints.create);
  if (validation) return next(new AppError(validation, 400));

  user.passwordConfirm = undefined;

  const newUser = await connection
    .getRepository(User)
    .save(await user.prepare());

  createSendToken(newUser, 201, res);
});

exports.signin = catchError(async ({ connection, body }, res, next) => {
  const { email, password } = body;

  const validation = validate(
    { email, password },
    userConstraints.emailAndPassword
  );
  if (validation) return next(new AppError(validation, 400));

  const additionalColumns = ['id', 'salt', 'password_hash'];

  const user = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .select('user')
    .addSelect(additionalColumns.map((column) => `user.${column}`))
    .where('user.email = :email', { email })
    .getOne();

  if (!user || !(await UserModel.correctPassword(password, user.password_hash)))
    return next(new AppError('Incorrect email or password', 401));

  createSendToken(user, 200, res);
});

exports.protect = catchError(async (req, res, next) => {
  let token;

  if (req.cookies.jwt) token = req.cookies.jwt;

  if (!token)
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );

  const { id } = jwt.decode(token);

  const additionalColumns =
    process.env.NODE_ENV === 'production'
      ? [
          'email',
          'salt',
          'password_hash',
          'password_reset_token',
          'password_changed_at',
          'active',
          'created_at',
          'updated_at',
        ]
      : [];

  const user = await req.connection
    .getRepository(User)
    .createQueryBuilder('user')
    .select('user')
    .addSelect(additionalColumns.map((column) => `user.${column}`))
    .where('user.id = :id', { id })
    .getOne();

  if (!user)
    return next(
      new AppError('The user belonging to this token does no longer exist')
    );

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET + user.salt
  );

  if (UserModel.changedPasswordAfter(user.password_changed_at, decoded.iat))
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );

  req.user = user;
  next();
});

exports.forgotPassword = catchError(async ({ connection, body }, res, next) => {
  const validation = validate({ email: body.email }, userConstraints.email);
  if (validation) return next(new AppError(validation, 400));

  const user = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .select('user')
    .where('user.email = :email', { email: body.email })
    .getOne();

  if (!user)
    return next(new AppError('There is no user with email address', 404));

  const {
    passwordResetToken,
    resetToken,
  } = UserModel.createPasswordResetToken();

  await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .update()
    .set({
      password_reset_token: passwordResetToken,
    })
    .where('user.id = :id', { id: user.id })
    .execute();

  // Sending reset url to the email
  res.status(200).json({
    status: 'success',
    resetToken,
    message: 'Token sent to email!',
  });
});

exports.resetPassword = catchError(
  async ({ connection, params, body }, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(params.token)
      .digest('hex');

    const user = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .select('user')
      .where('user.password_reset_token = :token', { token: hashedToken })
      .getOne();

    if (!user) return next(new AppError('Token has expired', 400));

    const { password, passwordConfirm } = body;

    const validation = validate(
      { password, passwordConfirm },
      userConstraints.newPassword
    );
    if (validation) return next(new AppError(validation, 400));

    await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .update()
      .set({
        password_reset_token: null,
        password_hash: await UserModel.hashPassword(password),
        password_changed_at: new Date().toISOString(),
      })
      .where('user.id = :id', { id: user.id })
      .execute();

    createSendToken(user, 200, res);
  }
);

exports.updatePassword = catchError(
  async ({ connection, user: currentUser, body }, res, next) => {
    const { password, passwordConfirm, newPassword } = body;

    const user = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .select('user')
      .where('user.id = :id', { id: currentUser.id })
      .getOne();

    if (!(await UserModel.correctPassword(password, user.password_hash)))
      return next(new AppError('Your current password is wrong', 401));

    const validation = validate(
      { password: newPassword, passwordConfirm },
      userConstraints.newPassword
    );
    if (validation) return next(new AppError(validation, 400));

    await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .update()
      .set({ password_hash: await UserModel.hashPassword(newPassword) })
      .where('user.id = :id', { id: user.id })
      .execute();

    createSendToken(user, 200, res);
  }
);
