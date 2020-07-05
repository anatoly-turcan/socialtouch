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
  // relations: {
  //   friends: {
  //     target: 'User',
  //     type: 'many-to-one',
  //     joinColumn: { name: 'friend_id', referencedColumnName: 'id' },
  //     cascade: true,
  //   },
  //   targets: {
  //     target: 'User',
  //     type: 'many-to-one',
  //     joinColumn: { name: 'target_id', referencedColumnName: 'id' },
  //     cascade: true,
  //   },
  // },
});
