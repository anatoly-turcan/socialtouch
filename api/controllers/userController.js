const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const userConstraints = require('../validators/userConstraints');
const userSettingsConstraints = require('../validators/userSettingsConstraints');
const User = require('../entities/userSchema');
const UserSettings = require('../entities/userSettingsSchema');
const handlerFactory = require('./handlerFactory');

const alias = 'user';

exports.getAllUsers = catchError(async ({ connection, query }, res, next) => {
  const filter = apiFilter(query, alias);

  const users = await connection
    .getRepository(User)
    .createQueryBuilder(alias)
    .select([...filter.fields])
    .where(`${alias}.active = 1`)
    .offset(filter.offset)
    .limit(filter.limit)
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

exports.getUser = handlerFactory.getOne({
  Entity: User,
  alias,
  where: `${alias}.active = 1 AND ${alias}.link = :link`,
  whereSelectors: [['link', 'params', 'link']],
  join: [],
});

exports.updateMe = handlerFactory.updateOne({
  Entity: User,
  bodyFields: ['username', 'email', 'link'],
  constraints: userConstraints.updateMe,
  where: 'id = :id',
  whereSelectors: [['id', 'user', 'id']],
});

exports.deleteMe = handlerFactory.deactivateOne({
  Entity: User,
  where: 'active = 1 AND id = :id',
  whereSelectors: [['id', 'user', 'id']],
});

exports.updateMySettings = handlerFactory.updateOne({
  Entity: UserSettings,
  bodyFields: ['age', 'gender', 'phone', 'town', 'school', 'job'],
  constraints: userSettingsConstraints,
  where: 'userId = :id',
  whereSelectors: [['id', 'user', 'id']],
});
