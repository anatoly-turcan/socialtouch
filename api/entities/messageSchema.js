const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Messages',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    room: {
      type: 'varchar',
      nullable: false,
    },
    userId: {
      type: 'int',
      nullable: false,
    },
    content: {
      type: 'text',
      nullable: false,
    },
    createdAt: {
      createDate: true,
    },
  },
  orderBy: {
    id: 'DESC',
  },
  relations: {
    user: {
      target: 'Users',
      type: 'many-to-one',
      joinTable: true,
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    },
  },
});
