const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'GroupMembers',
  columns: {
    group_id: {
      primary: true,
      type: 'int',
      nullable: false,
    },
    user_id: {
      primary: true,
      type: 'int',
      nullable: false,
    },
  },
});
