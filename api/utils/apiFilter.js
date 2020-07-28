const paginate = require('./paginate');

exports.fieldsFilter = (alias, allowableFields, fields) => {
  if (!fields) return allowableFields.map((field) => `${alias}.${field}`);

  return fields.split(',').reduce((acc, field) => {
    if (allowableFields.includes(field)) return [...acc, `${alias}.${field}`];

    return acc;
  }, []);
};

exports.apiFilter = (query, alias) => {
  const defaultLimit = 20;
  const result = {};

  if (query && query.fields) {
    const fields = query.fields.split(',').map((field) => `${alias}.${field}`);
    result.fields = [`${alias}.id`, ...fields];
  } else result.fields = [alias];

  if (query && query.order) {
    result.order = [
      `${alias}.id`,
      query.order && query.order === 'asc' ? 'ASC' : 'DESC',
    ];
  } else result.order = [`${alias}.id`, 'DESC'];

  result.limit = query.limit ? Math.abs(Number(query.limit)) : defaultLimit;

  result.offset = paginate(Math.abs(Number(query.page)) || 1, result.limit);

  return result;
};
