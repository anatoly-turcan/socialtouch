const { Table, TableForeignKey } = require('typeorm');

module.exports = class CreateUserSettingsTable1595394698658 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'user_settings',
        columns: [
          {
            name: 'user_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'age',
            type: 'tinyint',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'varchar',
            length: '6',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'town',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'school',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'job',
            type: 'varchar',
            isNullable: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      'user_settings',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );
  }

  async down(queryRunner) {
    const userSettingsTable = await queryRunner.getTable('user_settings');
    const foreignKey = userSettingsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('user_id') !== -1
    );
    await queryRunner.dropForeignKey('user_settings', foreignKey);
    await queryRunner.dropTable('user_settings');
  }
};
