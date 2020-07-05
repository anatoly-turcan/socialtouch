const { EntitySchema } = require('typeorm');

// const select = process.env.NODE_ENV === 'development';

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
      // select,
    },
    salt: {
      type: 'varchar',
      nullable: false,
      // select,
    },
    passwordHash: {
      type: 'varchar',
      nullable: false,
      // select,
    },
    passwordResetToken: {
      type: 'varchar',
      nullable: true,
      // select,
    },
    passwordChangedAt: {
      type: 'datetime',
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
      nullable: false,
      unique: true,
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
    groups: {
      target: 'Groups',
      type: 'many-to-many',
      inverseSide: 'subscribers',
    },
  },
});
