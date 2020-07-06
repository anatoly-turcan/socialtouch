const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const Group = require('../entities/groupSchema');
const GroupModel = require('../models/groupModel');
const groupConstraints = require('../validators/groupConstraints');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');

const alias = 'group';

exports.getAllGroups = catchError(async ({ connection, query }, res, next) => {
  const filter = apiFilter(query, alias);

  const groups = await connection
    .getRepository(Group)
    .createQueryBuilder(alias)
    .leftJoinAndSelect(`${alias}.image`, 'img')
    .leftJoinAndSelect(`${alias}.creator`, 'creator')
    .leftJoinAndSelect(`creator.image`, 'creatorImg')
    .select([
      ...filter.fields,
      'img.location',
      'creator.username',
      'creator.link',
      'creatorImg.location',
    ])
    .where(`${alias}.active = 1`)
    .orderBy(...filter.order)
    .offset(filter.offset)
    .limit(filter.limit)
    .getMany();

  res.status(200).json({
    status: 'success',
    results: groups.length,
    data: {
      groups,
    },
  });
});

exports.createGroup = handlerFactory.createOne({
  Entity: Group,
  Model: GroupModel,
  bodyFields: ['name', 'description'],
  userId: 'creatorId',
  constraints: groupConstraints.create,
  responseName: 'group',
});

exports.getGroup = handlerFactory.getOne({
  Entity: Group,
  alias,
  where: `${alias}.active = 1 AND ${alias}.link = :link`,
  whereSelectors: [['link', 'params', 'link']],
  join: [
    [`${alias}.image`, 'img'],
    [`${alias}.creator`, 'creator'],
    ['creator.image', 'creatorImage'],
  ],
  joinSelectors: [
    alias,
    'img.location',
    'creator.username',
    'creator.link',
    'creatorImage.location',
  ],
});

exports.updateGroup = handlerFactory.updateOne({
  Entity: Group,
  bodyFields: ['name', 'description'],
  constraints: groupConstraints.update,
  where: 'active = 1 AND link = :link AND creatorId = :id',
  whereSelectors: [
    ['link', 'params', 'link'],
    ['id', 'user', 'id'],
  ],
});

exports.deleteGroup = handlerFactory.deactivateOne({
  Entity: Group,
  where: 'active = 1 AND link = :link AND creatorId = :id',
  whereSelectors: [
    ['link', 'params', 'link'],
    ['id', 'user', 'id'],
  ],
});

exports.groupProtect = catchError(async (req, res, next) => {
  if (req.params.gLink) {
    const group = await req.connection
      .getRepository(Group)
      .findOne({ where: { link: req.params.gLink } });

    if (group) req.group = group;
    else return next(new AppError('Group not found', 404));
  }

  next();
});

exports.subscribe = catchError(
  async ({ connection, params, user }, res, next) => {
    const group = await connection.getRepository(Group).findOne({
      where: {
        link: params.link,
      },
    });

    if (!group) return next(new AppError('Document not found', 404));

    await connection
      .createQueryBuilder()
      .relation(Group, 'subscribers')
      .of(group.id) // id | object {id: ..., ...}
      .add(user.id); // id | object {id: ..., ...}

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.unsubscribe = catchError(
  async ({ connection, params, user }, res, next) => {
    const group = await connection.getRepository(Group).findOne({
      where: {
        link: params.link,
      },
    });

    if (!group) return next(new AppError('Document not found', 404));

    await connection
      .createQueryBuilder()
      .relation(Group, 'subscribers')
      .of(group.id) // id | object {id: ..., ...}
      .remove(user.id); // id | object {id: ..., ...}

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.getSubscribers = catchError(
  async ({ connection, params, query }, res, next) => {
    // const subscribers = await connection
    //   .createQueryBuilder()
    //   .select(['link'])
    //   .relation(Group, 'subscribers')
    //   .of(group.id)
    //   .loadMany();
    const { offset, limit } = apiFilter(query);

    const result = await connection
      .getRepository(Group)
      .createQueryBuilder('group')
      .leftJoinAndSelect('group.subscribers', 'subscribers')
      .leftJoinAndSelect('subscribers.image', 'img')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('g.id')
          .from(Group, 'g')
          .where('g.link = :link')
          .getQuery();
        return `group.id = ${subQuery}`;
      })
      .setParameter('link', params.link)
      .select([
        'group.id',
        'subscribers.username',
        'subscribers.link',
        'img.location',
      ])
      .offset(offset)
      .limit(limit)
      .getOne();

    if (!result) return next(new AppError('Document not found', 404));

    res.status(200).json({
      status: 'success',
      data: {
        subscribers: result.subscribers,
      },
    });
  }
);
