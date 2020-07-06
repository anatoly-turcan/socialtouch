const { EntitySchema } = require('typeorm');

// const select = process.env.NODE_ENV === 'development';

module.exports = new EntitySchema({
  name: 'Groups',
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
      nullable: true,
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
      target: 'Users',
      type: 'many-to-one',
      joinTable: true,
      joinColumn: { name: 'creator_id', referencedColumnName: 'id' },
      cascade: ['insert', 'update'],
      onDelete: 'SET NULL',
    },
    subscribers: {
      target: 'Users',
      type: 'many-to-many',
      joinTable: {
        name: 'group_subscribers',
        joinColumn: {
          name: 'group_id',
          referencedColumnName: 'id',
        },
        inverseJoinColumn: {
          name: 'user_id',
          referencedColumnName: 'id',
        },
      },

      inverseSide: 'groups',
      onDelete: 'CASCADE',
    },
    image: {
      target: 'Images',
      type: 'one-to-many',
      inverseSide: 'post',
      onDelete: 'SET NULL',
    },
  },
});
