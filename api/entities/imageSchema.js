const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Images',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    location: {
      type: 'varchar',
      nullable: false,
    },
    height: {
      type: 'int',
      nullable: true,
    },
    width: {
      type: 'int',
      nullable: true,
    },
    alt: {
      type: 'varchar',
      nullable: true,
    },
    createdAt: {
      createDate: true,
    },
  },
  relations: {
    user: {
      target: 'Users',
      type: 'one-to-one',
      inverseSide: 'image',
      onDelete: 'CASCADE',
    },
    group: {
      target: 'Groups',
      type: 'one-to-one',
      inverseSide: 'image',
      onDelete: 'CASCADE',
    },
    post: {
      target: 'Posts',
      type: 'one-to-one',
      inverseSide: 'image',
      onDelete: 'CASCADE',
    },
  },
});
