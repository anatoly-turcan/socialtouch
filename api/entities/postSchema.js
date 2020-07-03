const { EntitySchema } = require('typeorm');

// const select = process.env.NODE_ENV === 'development';

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
      // select,
    },
    group_id: {
      type: 'int',
      nullable: true,
      // select,
    },
    content: {
      type: 'text',
      nullable: false,
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
      // select,
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
