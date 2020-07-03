const { isEmpty } = require('validate.js');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const validate = require('../utils/validate');
const apiFilter = require('../utils/apiFilter');
const deleteUndefined = require('../utils/deleteUndefined');
const Group = require('../entities/groupSchema');
const GroupModel = require('../models/groupModel');
const groupConstraints = require('../validators/groupConstraints');

const alias = 'group';

exports.createGroup = catchError(
  async ({ connection, body, user }, res, next) => {
    const group = new GroupModel(body.name, body.description, user.id);

    const validation = validate(group, groupConstraints.create);
    if (validation) return next(new AppError(validation, 400));

    const newGroup = await connection
      .getRepository(Group)
      .save(group.prepare());

    res.status(201).json({
      status: 'success',
      data: {
        group: newGroup,
      },
    });
  }
);

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

exports.getGroup = catchError(async ({ connection, params }, res, next) => {
  const group = await connection
    .getRepository(Group)
    .createQueryBuilder(alias)
    .where(`active = 1 AND ${alias}.link = :link`, { link: params.link })
    .leftJoinAndSelect(`${alias}.creator`, 'creator')
    .select([alias, 'creator.username', 'creator.link', 'creator.img_id'])
    .getOne();

  if (!group) return next(new AppError('Document not found', 404));

  res.status(200).json({
    status: 'success',
    data: {
      group,
    },
  });
});

exports.updateGroup = catchError(
  async ({ connection, params, body, user }, res, next) => {
    const { name, description } = body;

    const newData = { name, description };
    deleteUndefined(newData);

    if (isEmpty(newData)) return next(new AppError('Nothing to update'));

    const validation = validate(newData, groupConstraints.update);
    if (validation) return next(new AppError(validation, 400));

    const { affected } = await connection
      .getRepository(Group)
      .createQueryBuilder()
      .update()
      .set(newData)
      .where('active = 1 AND link = :link AND creator_id = :id', {
        link: params.link,
        id: user.id,
      })
      .execute();

    if (!affected) return next(new AppError('Document not found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

exports.deleteGroup = catchError(
  async ({ connection, params, user }, res, next) => {
    const { affected } = await connection
      .getRepository(Group)
      .createQueryBuilder()
      .update()
      .set({ active: false })
      .where('active = 1 AND link = :link AND creator_id = :id', {
        link: params.link,
        id: user.id,
      })
      .execute();

    if (!affected) return next(new AppError('Document not found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
