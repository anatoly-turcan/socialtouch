const catchError = require('../utils/catchError');
const apiFilter = require('../utils/apiFilter');
const Group = require('../entities/groupSchema');
const GroupModel = require('../models/groupModel');
const groupConstraints = require('../validators/groupConstraints');
const handlerFactory = require('./handlerFactory');

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
