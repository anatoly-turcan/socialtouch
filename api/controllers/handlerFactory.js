const { isEmpty } = require('validate.js');
const catchError = require('../utils/catchError');
const AppError = require('../utils/appError');
const validate = require('../utils/validate');

exports.updateOne = (options) =>
  catchError(async (req, res, next) => {
    // example
    // where: 'id = :ID AND ....'
    // whereSelector: [['ID', 'USER', 'USER_ID'], ....]
    // extracts from req.USER.USER_ID into { ID: 'USER_ID', ....}
    const whereSelectors = options.whereSelectors.reduce((acc, selector) => {
      return {
        ...acc,
        [selector[0]]: req[selector[1]][selector[2]],
      };
    }, {});

    const newData = options.bodyFields.reduce((acc, field) => {
      return req.body[field] !== undefined
        ? {
            ...acc,
            [field]: req.body[field],
          }
        : acc;
    }, {});

    if (isEmpty(newData)) return next(new AppError('Nothing to update'));

    const validation = validate(newData, options.constraints);
    if (validation) return next(new AppError(validation, 400));

    const { affected } = await req.connection
      .getRepository(options.Model)
      .createQueryBuilder()
      .update()
      .set(newData)
      .where(options.where, whereSelectors)
      .execute();

    if (!affected) return next(new AppError('Document not found', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
