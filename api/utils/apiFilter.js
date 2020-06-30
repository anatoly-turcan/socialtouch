const paginate = require('./paginate');

module.exports = (query, id = 'id') => {
  const defaultLimit = 20;
  const result = {};

  if (query.order) {
    result.order = [
      ['created_at', query.order && query.order === 'asc' ? 'ASC' : 'DESC'],
      [id, 'DESC'],
    ];
  } else {
    result.order = [[id, 'DESC']];
  }

  if (query.fields) result.attributes = query.fields.split(',');

  result.limit = query.limit ? Math.abs(Number(query.limit)) : defaultLimit;

  if (query.page)
    result.offset = paginate(Math.abs(Number(query.page)) || 1, result.limit);

  return result;
};
