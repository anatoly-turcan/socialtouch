const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'Comments',
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true,
    },
    postId: {
      type: 'int',
      nullable: false,
    },
    userId: {
      type: 'int',
      nullable: false,
    },
    content: {
      type: 'text',
      nullable: false,
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
  orderBy: {
    id: 'DESC',
  },
  relations: {
    post: {
      target: 'Posts',
      type: 'many-to-one',
      cascade: true,
      inverseSide: 'comments',
      onDelete: 'CASCADE',
    },
    user: {
      target: 'Users',
      type: 'many-to-one',
      joinColumn: { name: 'user_id', referencedColumnName: 'id' },
      cascade: true,
      onDelete: 'CASCADE',
    },
  },
});
