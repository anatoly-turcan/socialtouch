const { Table, TableForeignKey } = require('typeorm');

module.exports = class CreateChatsTable1595397562968 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'chats',
        columns: [
          {
            name: 'user_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'target_id',
            type: 'int',
            isPrimary: true,
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
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'chats',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'chats',
      new TableForeignKey({
        columnNames: ['target_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  async down(queryRunner) {
    const chatsTable = await queryRunner.getTable('chats');

    let foreignKey = chatsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('target_id') !== -1
    );
    await queryRunner.dropForeignKey('chats', foreignKey);

    foreignKey = chatsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    await queryRunner.dropForeignKey('chats', foreignKey);

    await queryRunner.dropTable('chats');
  }
};
