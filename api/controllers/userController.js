const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const apiFilter = require('../utils/apiFilter');
const validate = require('../utils/validate');
const userConstraints = require('../validators/userConstraints');
const userSettingsConstraints = require('../validators/userSettingsConstraints');
const User = require('../entities/userSchema');
const UserSettings = require('../entities/userSettingsSchema');

exports.getAllUsers = catchError(async ({ connection, query }, res, next) => {
  const filter = apiFilter(query, 'user');

  const users = await connection
    .getRepository(User)
    .createQueryBuilder('user')
    .select([...filter.fields])
    .where('user.active = 1')
    .skip(filter.offset)
    .take(filter.limit)
    .orderBy(...filter.order)
    .getMany();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = catchError(async ({ connection, params }, res, next) => {
  const user = await connection
    .getRepository(User)
    .createQueryBuilder()
    .select()
    .where('active = 1 AND link = :link', { link: params.link })
    .getOne();

  if (process.env.NODE_ENV === 'production') delete user.id;

  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.getMe = catchError(async ({ connection, user }, res, next) => {
  const me = await connection
    .getRepository(User)
    .findOne({ where: { id: user.id } });

  res.status(200).json({
    status: 'success',
    data: {
      user: me,
    },
  });
});

exports.updateMe = catchError(async ({ connection, user, body }, res, next) => {
  const { username, email, link } = body;

  const newData = {};

  if (username) newData.username = username;
  if (email) newData.email = email;
  if (link) newData.link = link;

  if (!Object.keys(newData).length)
    return next(new AppError('Nothing to update', 400));

  const validation = validate(
    { username, email, link },
    userConstraints.updateMe
  );
  if (validation) return next(new AppError(validation, 400));

  await connection
    .getRepository(User)
    .createQueryBuilder()
    .update()
    .set(newData)
    .where('id = :id', { id: user.id })
    .execute();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteMe = catchError(async ({ connection, user }, res, next) => {
  await connection
    .getRepository(User)
    .createQueryBuilder()
    .update()
    .set({ active: false })
    .where('id = :id', { id: user.id })
    .execute();

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getMySettings = catchError(async ({ connection, user }, res, next) => {
  const settings = await connection
    .getRepository(UserSettings)
    .findOne({ where: { user_id: user.id } });

  res.status(200).json({
    status: 'success',
    data: {
      settings,
    },
  });
});

exports.updateMySettings = catchError(
  async ({ connection, user, body }, res, next) => {
    const { age, gender, phone, town, school, job } = body;

    const newData = {};

    if (age !== undefined) newData.age = age;
    if (gender !== undefined) newData.gender = gender;
    if (phone !== undefined) newData.phone = phone;
    if (town !== undefined) newData.town = town;
    if (school !== undefined) newData.school = school;
    if (job !== undefined) newData.job = job;

    if (!Object.keys(newData).length)
      return next(new AppError('Nothing to update', 400));

    const validation = validate({ age, gender }, userSettingsConstraints);
    if (validation) return next(new AppError(validation, 400));

    await connection
      .getRepository(UserSettings)
      .createQueryBuilder()
      .update()
      .set(newData)
      .where('user_id = :id', { id: user.id })
      .execute();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
