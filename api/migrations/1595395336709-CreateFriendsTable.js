const { Table, TableForeignKey } = require('typeorm');

module.exports = class CreateFriendsTable1595395336709 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'friends',
        columns: [
          {
            name: 'friend_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'target_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'by',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'active',
            type: 'boolean',
            isNullable: false,
            default: 'false',
          },
          {
            name: 'start_on',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP()',
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'friends',
      new TableForeignKey({
        columnNames: ['friend_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'friends',
      new TableForeignKey({
        columnNames: ['target_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  async down(queryRunner) {
    const friendsTable = await queryRunner.getTable('friends');

    let foreignKey = friendsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('target_id') !== -1
    );
    await queryRunner.dropForeignKey('friends', foreignKey);

    foreignKey = friendsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('friend_id') !== -1
    );
    await queryRunner.dropForeignKey('friends', foreignKey);

    await queryRunner.dropTable('friends');
  }
};
