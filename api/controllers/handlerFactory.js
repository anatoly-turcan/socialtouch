const { isEmpty } = require('validate.js');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const validate = require('../utils/validate');

const extractSelectors = (whereSelectors, req) =>
  whereSelectors.reduce((acc, selector) => {
    return {
      ...acc,
      [selector[0]]: req[selector[1]][selector[2]],
    };
  }, {});

const extractData = (bodyFields, body) =>
  bodyFields.reduce((acc, field) => {
    return body[field] !== undefined
      ? {
          ...acc,
          [field]: body[field],
        }
      : acc;
  }, {});

const insertData = (object, fields, data) =>
  fields.forEach((field) => {
    if (data[field]) object[field] = data[field];
  });

exports.updateOne = (options) =>
  catchError(async (req, res, next) => {
    const selectors = extractSelectors(options.whereSelectors, req);
    const newData = extractData(options.bodyFields, req.body);

    if (isEmpty(newData)) return next(new AppError('Nothing to update'));

    const validation = validate(newData, options.constraints);
    if (validation) return next(new AppError(validation, 400));

    if (req.group)
      options.where = `${options.where} AND groupId = ${req.group.id}`;

    const { affected } = await req.connection
      .getRepository(options.Entity)
      .createQueryBuilder()
      .update()
      .set(newData)
      .where(options.where, selectors)
      .execute();

    if (!affected) return next(new AppError('Document not found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.deactivateOne = (options) =>
  catchError(async (req, res, next) => {
    const selectors = extractSelectors(options.whereSelectors, req);

    const { affected } = await req.connection
      .getRepository(options.Entity)
      .createQueryBuilder()
      .update()
      .set({ active: false })
      .where(options.where, selectors)
      .execute();

    if (!affected) return next(new AppError('Document not found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.deleteOne = (options) =>
  catchError(async (req, res, next) => {
    const selectors = extractSelectors(options.whereSelectors, req);

    if (req.group)
      options.where = `${options.where} AND groupId = ${req.group.id}`;

    const { affected } = await req.connection
      .getRepository(options.Entity)
      .createQueryBuilder()
      .delete()
      .where(options.where, selectors)
      .execute();

    if (!affected) return next(new AppError('Document not found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.createOne = (options) =>
  catchError(async (req, res, next) => {
    const Model = new options.Model();
    insertData(Model, options.bodyFields, req.body);

    if (options.userId) Model[options.userId] = req.user.id;
    if (req.group) Model.groupId = req.group.id;
    if (req.post) Model.postId = req.post.id;

    const validation = validate(Model, options.constraints);
    if (validation) return next(new AppError(validation, 400));

    const newDocument = await req.connection
      .getRepository(options.Entity)
      .save(Model.prepare());

    if (process.env.NODE_ENV === 'production') delete newDocument.id;

    res.status(201).json({
      status: 'success',
      data: {
        [options.responseName]: newDocument,
      },
    });
  });

exports.getOne = (options) =>
  catchError(async (req, res, next) => {
    const selectors = extractSelectors(options.whereSelectors, req);

    const prepare = req.connection
      .getRepository(options.Entity)
      .createQueryBuilder(options.alias)
      .where(options.where, selectors);

    if (options.join.length)
      prepare
        .leftJoinAndSelect(...options.join)
        .select([options.alias, ...options.joinSelectors]);
    else prepare.select();

    const document = await prepare.getOne();

    if (!document) return next(new AppError('Document not found', 404));
    if (process.env.NODE_ENV === 'production') delete document.id;
    if (options.add) await options.add(document, req);

    res.status(200).json({
      status: 'success',
      data: {
        [options.alias]: document,
      },
    });
  });
