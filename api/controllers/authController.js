const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const userModel = require('../models/userModel');

const signToken = (id, salt) => {
  return jwt.sign({ id }, process.env.JWT_SECRET + salt, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.user_id, user.salt);

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

exports.signup = catchError(async ({ User, body }, res, next) => {
  const validationError = User.validate(body);

  if (validationError) return next(new AppError(validationError, 400));

  const newUser = await User.create({
    username: body.username,
    email: body.email,
    password_hash: await User.hashPassword(body.password, 12),
    salt: User.generateSalt(),
    link: User.generateLink(),
  });

  createSendToken(newUser, 201, res);
});

exports.signin = catchError(async ({ User, body }, res, next) => {
  const { email, password } = body;

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ where: { email } });

  if (!user || !(await User.correctPassword(password, user.password_hash)))
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

  const User = userModel(req.db);

  const userId = jwt.decode(token).id;

  const { dataValues: currentUser } = await User.findByPk(userId);

  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does no longer exist')
    );

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET + currentUser.salt
  );

  if (User.changedPasswordAfter(currentUser.password_changed_at, decoded.iat))
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );

  req.user = currentUser;
  next();
});

exports.forgotPassword = catchError(async ({ User, body }, res, next) => {
  const user = await User.findOne({ where: { email: body.email } });

  const validationError = User.validate({ email: body.email }, { email: true });

  if (validationError) return next(new AppError(validationError, 400));

  if (!user)
    return next(new AppError('There is no user with email address', 404));

  const { passwordResetToken, resetToken } = User.createPasswordResetToken();

  await User.update(
    { password_reset_token: passwordResetToken },
    {
      where: {
        user_id: user.user_id,
      },
    }
  );

  // Sending reset url to the email
  res.status(200).json({
    status: 'success',
    resetToken,
    message: 'Token sent to email!',
  });
});

exports.resetPassword = catchError(
  async ({ User, params, body }, res, next) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(params.token)
      .digest('hex');

    const user = await User.findOne({
      where: { password_reset_token: hashedToken },
    });

    if (!user) return next(new AppError('Token has expired', 400));

    const { password, passwordConfirm } = body;

    const validationError = User.validate(
      { password, passwordConfirm },
      { password: true }
    );

    if (validationError) return next(new AppError(validationError, 400));

    await User.update(
      {
        password_reset_token: null,
        password_hash: await User.hashPassword(password, 12),
        password_changed_at: Date.now(),
      },
      {
        where: {
          user_id: user.user_id,
        },
      }
    );

    createSendToken(user, 200, res);
  }
);

exports.updatePassword = catchError(
  async ({ User, user: currentUser, body }, res, next) => {
    const { password, passwordConfirm, newPassword } = body;

    const validationError = User.validate(
      { password: newPassword, passwordConfirm },
      { password: true }
    );

    if (validationError) return next(new AppError(validationError, 400));

    const user = await User.findByPk(currentUser.user_id);

    if (!(await User.correctPassword(password, user.password_hash)))
      return next(new AppError('Your current password is wrong', 401));

    await User.update(
      {
        password_hash: await User.hashPassword(newPassword),
        password_changed_at: Date.now(),
      },
      {
        where: {
          user_id: user.user_id,
        },
      }
    );

    createSendToken(user, 200, res);
  }
);
