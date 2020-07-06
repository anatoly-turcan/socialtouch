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
    userOne: {
      target: 'Users',
      type: 'one-to-one',
      inverseSide: 'image',
    },
    userMany: {
      target: 'Users',
      type: 'many-to-many',
      inverseSide: 'images',
    },
    group: {
      target: 'Groups',
      type: 'one-to-one',
      inverseSide: 'image',
    },
    post: {
      target: 'Posts',
      type: 'many-to-many',
      inverseSide: 'images',
    },
  },
});
