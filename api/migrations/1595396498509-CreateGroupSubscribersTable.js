const { Table, TableForeignKey } = require('typeorm');

module.exports = class CreateGroupSubscribersTable1595396498509 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'group_subscribers',
        columns: [
          {
            name: 'group_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'group_subscribers',
      new TableForeignKey({
        columnNames: ['group_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'groups',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'group_subscribers',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  async down(queryRunner) {
    const groupSubscribersTable = await queryRunner.getTable(
      'group_subscribers'
    );

    let foreignKey = groupSubscribersTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    await queryRunner.dropForeignKey('group_subscribers', foreignKey);

    foreignKey = groupSubscribersTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('group_id') !== -1
    );
    await queryRunner.dropForeignKey('group_subscribers', foreignKey);

    await queryRunner.dropTable('group_subscribers');
  }
};
