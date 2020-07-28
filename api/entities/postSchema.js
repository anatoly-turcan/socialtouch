const { EntitySchema } = require('typeorm');

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
      nullable: true,
    },
    groupId: {
      type: 'int',
      nullable: true,
    },
    content: {
      type: 'text',
      nullable: false,
    },
    previewLimit: {
      type: 'int',
      default: 2000,
    },
    imgId: {
      type: 'int',
      nullable: true,
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
    },
  },
  relations: {
    user: {
      target: 'Users',
      type: 'many-to-one',
      onDelete: 'CASCADE',
    },
    group: {
      target: 'Groups',
      type: 'many-to-one',
      onDelete: 'CASCADE',
      joinColumn: { name: 'group_id', referencedColumnName: 'id' },
    },
    comments: {
      target: 'Comments',
      type: 'one-to-many',
      inverseSide: 'post',
    },
    image: {
      target: 'Images',
      type: 'one-to-one',
      inverseSide: 'post',
      joinColumn: { name: 'img_id', referencedColumnName: 'id' },
    },
  },
});
