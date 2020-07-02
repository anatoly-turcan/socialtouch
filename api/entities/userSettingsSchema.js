const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'UserSettings',
  columns: {
    user_id: {
      primary: true,
      type: 'int',
      nullable: false,
    },
    age: {
      type: 'tinyint',
      nullable: true,
    },
    gender: {
      type: 'varchar',
      nullable: true,
      length: 6,
    },
    phone: {
      type: 'varchar',
      nullable: true,
    },
    town: {
      type: 'varchar',
      nullable: true,
    },
    school: {
      type: 'varchar',
      nullable: true,
    },
    job: {
      type: 'varchar',
      nullable: true,
    },
  },
});
