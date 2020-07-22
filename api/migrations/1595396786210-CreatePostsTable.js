const { Table, TableForeignKey } = require('typeorm');

module.exports = class CreatePostsTable1595396786210 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'posts',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'group_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'preview_limit',
            type: 'int',
            isNullable: false,
            default: '2000',
          },
          {
            name: 'link',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'img_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP()',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP()',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['group_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'groups',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'posts',
      new TableForeignKey({
        columnNames: ['img_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'images',
        onDelete: 'SET NULL',
      })
    );
  }

  async down(queryRunner) {
    const postsTable = await queryRunner.getTable('posts');

    let foreignKey = postsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('img_id') !== -1
    );
    await queryRunner.dropForeignKey('posts', foreignKey);

    foreignKey = postsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('group_id') !== -1
    );
    await queryRunner.dropForeignKey('posts', foreignKey);

    foreignKey = postsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    await queryRunner.dropForeignKey('posts', foreignKey);

    await queryRunner.dropTable('posts');
  }
};
