const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const userConstraints = require('../validators/userConstraints');
const userSettingsConstraints = require('../validators/userSettingsConstraints');
const User = require('../entities/userSchema');
const UserSettings = require('../entities/userSettingsSchema');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

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
    .findOne({ where: { userId: user.id } });

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

exports.getGroups = catchError(
  async ({ connection, params, query }, res, next) => {
    const { offset, limit } = apiFilter(query);

    const result = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.groups', 'groups')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('u.id')
          .from(User, 'u')
          .where('u.link = :link')
          .getQuery();
        return `user.id = ${subQuery}`;
      })
      .setParameter('link', params.link)
      .select(['user.id', 'groups.name', 'groups.link', 'groups.imgId'])
      .offset(offset)
      .limit(limit)
      .getOne();

    if (!result) return next(new AppError('Document not found', 404));

    res.status(200).json({
      status: 'success',
      data: {
        groups: result.groups,
      },
    });
  }
);

exports.addFriend = catchError(
  async ({ connection, params, user }, res, next) => {
    if (params.link === user.link)
      return next(new AppError('You cannot add yourself as a friend', 400));

    const target = await connection
      .getRepository(User)
      .findOne({ where: { link: params.link } });

    if (!target) return next(new AppError('User not found', 404));

    await connection
      .createQueryBuilder()
      .relation(User, 'targets')
      .of(Math.min(target.id, user.id))
      .add(Math.max(target.id, user.id));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.unfriend = catchError(
  async ({ connection, params, user }, res, next) => {
    const target = await connection
      .getRepository(User)
      .findOne({ where: { link: params.link } });

    if (!target) return next(new AppError('User not found', 404));

    await connection
      .createQueryBuilder()
      .relation(User, 'targets')
      .of(Math.min(target.id, user.id))
      .remove(Math.max(target.id, user.id));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.getFriends = catchError(
  async ({ connection, params, query }, res, next) => {
    const { offset, limit } = apiFilter(query);

    const result = await connection
      .getRepository(User)
      .createQueryBuilder('user')
      .leftJoin('user.targets', 'targets')
      .leftJoin('user.friends', 'friends')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('u.id')
          .from(User, 'u')
          .where('u.link = :link')
          .getQuery();
        return `user.id = ${subQuery}`;
      })
      .setParameter('link', params.link)
      .select([
        'user.id',
        'targets.username',
        'targets.link',
        'targets.imgId',
        'friends.username',
        'friends.link',
        'friends.imgId',
      ])
      .offset(offset)
      .limit(limit - 1)
      .getOne();

    if (!result) return next(new AppError('Document not found', 404));

    res.status(200).json({
      status: 'success',
      data: {
        friends: [...result.friends, ...result.targets],
      },
    });
  }
);
