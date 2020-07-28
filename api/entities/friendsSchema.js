const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Friends',
  columns: {
    friendId: {
      primary: true,
      type: 'int',
    },
    targetId: {
      primary: true,
      type: 'int',
    },
    by: {
      type: 'int',
      nullable: false,
    },
    active: {
      type: 'boolean',
      default: false,
      nullable: false,
    },
    startOn: {
      updateDate: true,
    },
  },
});
