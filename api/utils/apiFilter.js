const paginate = require('./paginate');

module.exports = (query, prefix) => {
  const defaultLimit = 20;
  const result = {};

  if (query && query.fields) {
    const fields = query.fields.split(',').map((field) => `${prefix}.${field}`);
    result.fields = [`${prefix}.id`, ...fields];
  } else result.fields = [prefix];

  if (query && query.order) {
    result.order = [
      `${prefix}.created_at`,
      query.order && query.order === 'asc' ? 'ASC' : 'DESC',
    ];
  } else result.order = [`${prefix}.id`, 'DESC'];

  result.limit = query.limit ? Math.abs(Number(query.limit)) : defaultLimit;

  result.offset = paginate(Math.abs(Number(query.page)) || 1, result.limit);

  return result;
};
