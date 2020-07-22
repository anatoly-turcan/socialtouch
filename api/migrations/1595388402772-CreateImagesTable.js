const { Table } = require('typeorm');

module.exports = class CreateImagesTable1595388402772 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'images',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'location',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'height',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'width',
            type: 'int',
            isNullable: true,
          },
          {
            name: 'alt',
            type: 'varchar',
            isNullable: true,
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
  }

  async down(queryRunner) {
    await queryRunner.dropTable('images');
  }
};
