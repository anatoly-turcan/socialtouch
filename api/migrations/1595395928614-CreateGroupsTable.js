const { Table, TableForeignKey } = require('typeorm');

module.exports = class CreateGroupsTable1595395928614 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'groups',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'creator_id',
            type: 'int',
            isNullable: false,
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
      'groups',
      new TableForeignKey({
        columnNames: ['creator_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      })
    );

    await queryRunner.createForeignKey(
      'groups',
      new TableForeignKey({
        columnNames: ['img_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'images',
        onDelete: 'SET NULL',
      })
    );
  }

  async down(queryRunner) {
    const groupsTable = await queryRunner.getTable('groups');

    let foreignKey = groupsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('img_id') !== -1
    );
    await queryRunner.dropForeignKey('groups', foreignKey);

    foreignKey = groupsTable.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('creator_id') !== -1
    );
    await queryRunner.dropForeignKey('groups', foreignKey);

    await queryRunner.dropTable('groups');
  }
};
