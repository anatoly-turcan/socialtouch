const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Post',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    user_id: {
      type: 'int',
      nullable: false,
    },
    group_id: {
      type: 'int',
      nullable: true,
    },
    content: {
      type: 'text',
      nullable: true,
    },
    preview_limit: {
      type: 'int',
      default: 0,
    },
    link: {
      type: 'varchar',
      unique: true,
      nullable: true,
    },
    created_at: {
      createDate: true,
    },
    updated_at: {
      updateDate: true,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinTable: true,
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      cascade: ['insert', 'update'],
    },
  },
});
