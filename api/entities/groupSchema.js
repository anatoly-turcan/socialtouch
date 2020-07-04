const { EntitySchema } = require('typeorm');

// const select = process.env.NODE_ENV === 'development';

module.exports = new EntitySchema({
  name: 'Group',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    name: {
      type: 'varchar',
      nullable: false,
      unique: true,
    },
    description: {
      type: 'text',
      nullable: true,
    },
    creatorId: {
      type: 'int',
      nullable: false,
      // select,
    },
    imgId: {
      type: 'int',
      nullable: true,
      // select,
    },
    link: {
      type: 'varchar',
      unique: true,
      nullable: false,
    },
    active: {
      type: 'boolean',
      default: true,
      nullable: false,
      // select,
    },
    createdAt: {
      createDate: true,
      // select,
    },
    updatedAt: {
      updateDate: true,
      // select,
    },
  },
  relations: {
    creator: {
      target: 'User',
      type: 'many-to-one',
      joinTable: true,
      joinColumn: { name: 'creator_id', referencedColumnName: 'id' },
      cascade: ['insert', 'update'],
    },
    subscribers: {
      target: 'User',
      type: 'many-to-many',
      joinTable: true,
    },
  },
});
