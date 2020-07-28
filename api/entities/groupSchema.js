const { EntitySchema } = require('typeorm');

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
    },
    imgId: {
      type: 'int',
      nullable: true,
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
    },
    createdAt: {
      createDate: true,
    },
    updatedAt: {
      updateDate: true,
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
      type: 'one-to-one',
      inverseSide: 'group',
      onDelete: 'SET NULL',
      joinColumn: { name: 'img_id', referencedColumnName: 'id' },
    },
  },
});
