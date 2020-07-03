const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const Group = require('../entities/groupSchema');
const GroupMembers = require('../entities/groupMembersSchema');
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
    .leftJoinAndSelect(`${alias}.creator`, 'creator')
    .select([
      ...filter.fields,
      'creator.username',
      'creator.link',
      'creator.img_id',
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
  userId: 'creator_id',
  constraints: groupConstraints.create,
  responseName: 'group',
});

exports.getGroup = handlerFactory.getOne({
  Entity: Group,
  alias,
  where: `${alias}.active = 1 AND ${alias}.link = :link`,
  whereSelectors: [['link', 'params', 'link']],
  join: [`${alias}.creator`, 'creator'],
  joinSelectors: ['creator.username', 'creator.link', 'creator.img_id'],
});

exports.updateGroup = handlerFactory.updateOne({
  Entity: Group,
  bodyFields: ['name', 'description'],
  constraints: groupConstraints.update,
  where: 'active = 1 AND link = :link AND creator_id = :id',
  whereSelectors: [
    ['link', 'params', 'link'],
    ['id', 'user', 'id'],
  ],
});

exports.deleteGroup = handlerFactory.deactivateOne({
  Entity: Group,
  where: 'active = 1 AND link = :link AND creator_id = :id',
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
    const group = await connection
      .getRepository(Group)
      .findOne({ where: { link: params.link } });

    if (!group) return next(new AppError('Group not found', 404));

    await connection
      .getRepository(GroupMembers)
      .createQueryBuilder()
      .insert()
      .values({ group_id: group.id, user_id: user.id })
      .execute();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.unsubscribe = catchError(
  async ({ connection, params, user }, res, next) => {
    const group = await connection
      .getRepository(Group)
      .findOne({ where: { link: params.link } });

    if (!group) return next(new AppError('Group not found', 404));

    await connection
      .getRepository(GroupMembers)
      .createQueryBuilder()
      .delete()
      .where('group_id = :group_id AND user_id = :user_id', {
        group_id: group.id,
        user_id: user.id,
      })
      .execute();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
