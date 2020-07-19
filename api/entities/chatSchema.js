const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Chats',
  columns: {
    userId: {
      primary: true,
      type: 'int',
    },
    targetId: {
      primary: true,
      type: 'int',
    },
    link: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    createdAt: {
      createDate: true,
    },
  },
});
