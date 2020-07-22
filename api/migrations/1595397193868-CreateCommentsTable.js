const { Table, TableForeignKey } = require('typeorm');

module.exports = class CreateCommentsTable1595397193868 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'comments',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'post_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'link',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
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
      'comments',
      new TableForeignKey({
        columnNames: ['post_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'posts',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'comments',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  async down(queryRunner) {
    const commentsTable = await queryRunner.getTable('comments');

    let foreignKey = commentsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    await queryRunner.dropForeignKey('comments', foreignKey);

    foreignKey = commentsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('post_id') !== -1
    );
    await queryRunner.dropForeignKey('comments', foreignKey);

    await queryRunner.dropTable('comments');
  }
};
