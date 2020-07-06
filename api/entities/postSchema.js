const { EntitySchema } = require('typeorm');

// const select = process.env.NODE_ENV === 'development';

module.exports = new EntitySchema({
  name: 'Posts',
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
      target: 'Users',
      type: 'many-to-one',
      cascade: true,
      onDelete: 'CASCADE',
    },
    comments: {
      target: 'Comments',
      type: 'one-to-many',
      inverseSide: 'post',
    },
    images: {
      target: 'Images',
      type: 'one-to-many',
      inverseSide: 'post',
    },
  },
});
