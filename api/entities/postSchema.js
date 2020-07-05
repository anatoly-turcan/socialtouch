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
    userId: {
      type: 'int',
      nullable: false,
      // select,
    },
    groupId: {
      type: 'int',
      nullable: true,
      // select,
    },
    content: {
      type: 'text',
      nullable: false,
    },
    previewLimit: {
      type: 'int',
      default: 0,
    },
    link: {
      type: 'varchar',
      unique: true,
      nullable: true,
    },
    createdAt: {
      createDate: true,
    },
    updatedAt: {
      updateDate: true,
      // select,
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      cascade: true,
    },
  },
});
