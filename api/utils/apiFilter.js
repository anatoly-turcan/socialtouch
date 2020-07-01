const paginate = require('./paginate');

module.exports = (query, Model) => {
  const defaultLimit = 20;
  const result = {};

  const attributes = Object.keys(Model.tableAttributes);

  const id = attributes[0];

  const exclude =
    process.env.NODE_ENV === 'production'
      ? [
          'id',
          'post_id',
          'user_id',
          'group_id',
          'salt',
          'password_hash',
          'password_reset_token',
          'password_changed_at',
          'created_at',
          'updated_at',
        ]
      : [];

  if (query && query.fields) {
    result.attributes = query.fields
      .split(',')
      .filter((attribute) => !exclude.includes(attribute));
  } else {
    result.attributes = attributes.filter(
      (attribute) => !exclude.includes(attribute)
    );
  }

  if (query) {
    if (query.order) {
      result.order = [
        ['created_at', query.order && query.order === 'asc' ? 'ASC' : 'DESC'],
        [id, 'DESC'],
      ];
    } else {
      result.order = [[id, 'DESC']];
    }
  }

  if (query)
    result.limit = query.limit ? Math.abs(Number(query.limit)) : defaultLimit;

  if (query && query.page)
    result.offset = paginate(Math.abs(Number(query.page)) || 1, result.limit);

  return result;
};
