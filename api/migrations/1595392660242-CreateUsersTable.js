const { Table, TableForeignKey } = require('typeorm');

module.exports = class CreateUsersTable1595392660242 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'username',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'salt',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password_reset_token',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'password_changed_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'img_id',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'link',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'active',
            type: 'boolean',
            isNullable: false,
            default: 'true',
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
      'users',
      new TableForeignKey({
        columnNames: ['img_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'images',
        onDelete: 'CASCADE',
      })
    );
  }

  async down(queryRunner) {
    const usersTable = await queryRunner.getTable('users');
    const foreignKey = usersTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('img_id') !== -1
    );
    await queryRunner.dropForeignKey('users', foreignKey);
    await queryRunner.dropTable('users');
  }
};
