const { EntitySchema } = require('typeorm');

const select = process.env.NODE_ENV === 'development';

module.exports = new EntitySchema({
  name: 'User',
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
      select,
    },
    salt: {
      type: 'varchar',
      nullable: false,
      select,
    },
    password_hash: {
      type: 'varchar',
      nullable: false,
      select,
    },
    password_reset_token: {
      type: 'varchar',
      nullable: true,
      select,
    },
    password_changed_at: {
      type: 'datetime',
      nullable: true,
      select,
    },
    img_id: {
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
      select,
    },
    created_at: {
      createDate: true,
      select,
    },
    updated_at: {
      updateDate: true,
      select,
    },
  },
});
