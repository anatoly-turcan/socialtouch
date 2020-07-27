const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const userConstraints = require('../validators/userConstraints');
const userSettingsConstraints = require('../validators/userSettingsConstraints');
const User = require('../entities/userSchema');
const Group = require('../entities/groupSchema');
const UserSettings = require('../entities/userSettingsSchema');
const Friends = require('../entities/friendsSchema');
const Image = require('../entities/imageSchema');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');
const cloud = require('../utils/cloud');

const alias = 'user';

exports.getAllUsers = catchError(async ({ connection, query }, res, next) => {
  const filter = apiFilter(query, alias);

  const users = await connection
    .getRepository(User)
    .createQueryBuilder(alias)
    .leftJoinAndSelect(`${alias}.image`, 'image')
    .select([...filter.fields, 'image.location'])
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
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.image', 'image')
    .select(['user.username', 'user.link', 'user.email', 'image.location'])
    .where('user.id = :id', { id: user.id })
    .getOne();

  res.status(200).json({
    status: 'success',
    data: {
      user: me,
    },
  });
});

exports.getUserSettings = catchError(
  async ({ connection, params }, res, next) => {
    const settings = await connection
      .getRepository(UserSettings)
      .createQueryBuilder('settings')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from(User, alias)
          .where('user.link = :link')
          .getQuery();
        return `settings.userId = ${subQuery}`;
      })
      .setParameter('link', params.link)
      .getOne();

    settings.id = undefined;
    settings.userId = undefined;

    res.status(200).json({
      status: 'success',
      data: {
        settings,
      },
    });
  }
);

exports.getMySettings = catchError(async ({ connection, user }, res, next) => {
  const settings = await connection
    .getRepository(UserSettings)
    .findOne({ where: { userId: user.id } });

  settings.userId = undefined;

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
  join: [[`${alias}.image`, 'image']],
  select: [
    `${alias}.id`,
    `${alias}.username`,
    `${alias}.link`,
    'image.location',
  ],
  add: async (doc, req) => {
    const { count } = await req.connection
      .getRepository(Friends)
      .createQueryBuilder('friend')
      .select('COUNT(*)', 'count')
      .where(
        'friend.friendId = :friendId AND friend.targetId = :targetId AND friend.active = 1',
        {
          friendId: Math.min(doc.id, req.user.id),
          targetId: Math.max(doc.id, req.user.id),
        }
      )
      .getRawOne();

    doc.isFriend = count > 0;
  },
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

    const groups = await connection
      .getRepository(Group)
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.image', 'image')
      .leftJoinAndSelect('group.subscribers', 'subscribers')
      .where((qb) => {
        const userId = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.link = :link')
          .getQuery();
        return `group.active = 1 AND subscribers.id = ${userId}`;
      })
      .setParameter('link', params.link)
      .select(['group.id', 'group.name', 'group.link', 'image.location'])
      .skip(offset)
      .take(limit)
      .getMany();

    res.status(200).json({
      status: 'success',
      data: {
        groups,
      },
    });
  }
);

exports.getGroupsCount = catchError(
  async ({ connection, params }, res, next) => {
    const { count } = await connection
      .getRepository(User)
      .createQueryBuilder(alias)
      .leftJoinAndSelect(`${alias}.groups`, 'groups')
      .where('user.link = :link AND groups.active = 1', { link: params.link })
      .select('COUNT(groups.id)', 'count')
      .getRawOne();

    res.status(200).json({
      status: 'success',
      data: {
        count: Number(count),
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

    const { raw } = await connection
      .getRepository(Friends)
      .createQueryBuilder()
      .insert()
      .values({
        friendId: Math.min(target.id, user.id),
        targetId: Math.max(target.id, user.id),
        by: user.id,
      })
      .execute();

    if (!raw.affectedRows)
      return next(new AppError('Can not add to the friend. Try again later'));

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

    const { affected } = await connection
      .getRepository(Friends)
      .createQueryBuilder()
      .delete()
      .where('friendId = :friendId AND targetId = :targetId', {
        friendId: Math.min(target.id, user.id),
        targetId: Math.max(target.id, user.id),
      })
      .execute();

    if (!affected)
      return next(
        new AppError('Impossible to unfriend. You are not friends', 400)
      );

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
      .getRepository(Friends)
      .createQueryBuilder('f')
      .leftJoinAndSelect(User, 'u', 'f.friendId = u.id OR f.targetId = u.id')
      .leftJoinAndSelect('u.image', 'img')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.link = :link')
          .getQuery();
        return `u.id != ${subQuery} AND f.active = 1 AND (f.friendId = ${subQuery} OR f.targetId = ${subQuery})`;
      })
      .setParameter('link', params.link)
      .select(['u.username', 'u.link', 'img.location'])
      .offset(offset)
      .limit(limit)
      .getRawMany();

    if (!result) return next(new AppError('Document not found', 404));

    const friends = result.map((el) => {
      return Object.keys(el).reduce((acc, key) => {
        return { ...acc, [key.replace('u_', '')]: el[key] };
      }, {});
    });

    res.status(200).json({
      status: 'success',
      results: result.length,
      data: {
        friends,
      },
    });
  }
);

exports.getFriendsCount = catchError(
  async ({ connection, params }, res, next) => {
    const { count } = await connection
      .getRepository(Friends)
      .createQueryBuilder('friends')
      .where((qb) => {
        const id = qb
          .subQuery()
          .select('user.id')
          .from(User, 'user')
          .where('user.link = :link')
          .getQuery();
        return `friends.active = 1 AND (friends.friendId = ${id} OR friends.targetId = ${id})`;
      })
      .setParameter('link', params.link)
      .select('COUNT(*)', 'count')
      .getRawOne();

    res.status(200).json({
      status: 'success',
      data: {
        count: Number(count),
      },
    });
  }
);

exports.confirmFriendship = catchError(
  async ({ connection, params, user }, res, next) => {
    const friend = await connection
      .getRepository(User)
      .findOne({ where: { link: params.link } });

    const { affected } = await connection
      .getRepository(Friends)
      .createQueryBuilder()
      .update()
      .set({ active: true })
      .where('friendId = :friendId AND targetId = :targetId AND by != :id', {
        friendId: Math.min(user.id, friend.id),
        targetId: Math.max(user.id, friend.id),
        id: user.id,
      })
      .execute();

    if (!affected)
      return next(new AppError('This friend request does not exist', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.getFriendRequests = catchError(
  async ({ connection, user }, res, next) => {
    const result = await connection
      .getRepository(Friends)
      .createQueryBuilder('f')
      .leftJoinAndSelect(User, 'u', 'f.friendId = u.id OR f.targetId = u.id')
      .leftJoinAndSelect('u.image', 'img')
      .where(
        `u.id != :id AND f.active = 0 AND f.by != :id AND (f.friendId = :id OR f.targetId = :id)`,
        { id: user.id }
      )
      .select(['u.username', 'u.link', 'img.location'])
      .getRawMany();

    const requests = result.map((el) => {
      return Object.keys(el).reduce((acc, key) => {
        return { ...acc, [key.replace('u_', '')]: el[key] };
      }, {});
    });

    res.status(200).json({
      status: 'success',
      data: {
        requests,
      },
    });
  }
);

exports.updateImage = catchError(
  async ({ connection, user, files }, res, next) => {
    if (!files.length) return next(new AppError('No image', 400));

    const data = await cloud.uploadImage(files[0], 400);

    const newImage = await connection
      .getRepository(Image)
      .createQueryBuilder()
      .insert()
      .values(data)
      .execute();

    const imgId = newImage.identifiers[0].id;

    await connection
      .getRepository(User)
      .createQueryBuilder()
      .update()
      .set({ imgId })
      .where(`id = :id`, { id: user.id })
      .execute();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.searchUsers = catchError(async ({ connection, query }, res, next) => {
  if (!query.query)
    return next(new AppError('Please specify search query', 400));

  const users = await connection
    .getRepository(User)
    .createQueryBuilder(alias)
    .leftJoinAndSelect(`${alias}.image`, 'image')
    .where(`${alias}.active = 1 AND ${alias}.username REGEXP :r`, {
      r: query.query,
    })
    .select([
      `${alias}.id`,
      `${alias}.username`,
      `${alias}.link`,
      'image.location',
    ])
    .getMany();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
