const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Users',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    username: {
      type: 'varchar',
      nullable: false,
      unique: true,
    },
    email: {
      type: 'varchar',
      nullable: false,
      unique: true,
    },
    salt: {
      type: 'varchar',
      nullable: false,
    },
    passwordHash: {
      type: 'varchar',
      nullable: false,
    },
    passwordResetToken: {
      type: 'varchar',
      nullable: true,
    },
    passwordChangedAt: {
      type: 'datetime',
      nullable: true,
    },
    imgId: {
      type: 'int',
      nullable: true,
    },
    link: {
      type: 'varchar',
      nullable: false,
      unique: true,
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
    groups: {
      target: 'Groups',
      type: 'many-to-many',
      inverseSide: 'subscribers',
    },
    image: {
      target: 'Images',
      type: 'one-to-one',
      inverseSide: 'user',
      joinColumn: { name: 'img_id', referencedColumnName: 'id' },
    },
  },
});
