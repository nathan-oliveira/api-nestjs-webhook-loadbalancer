import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class Vehicles1735315829365 implements MigrationInterface {
  private table = new Table({
    name: 'vehicles',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'company_id',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'license',
        type: 'varchar',
        length: '25',
        isNullable: false,
      },
      {
        name: 'vin',
        type: 'varchar',
        length: '300',
        isNullable: false,
      },
      {
        name: 'lat',
        type: 'float8',
        isNullable: true,
      },
      {
        name: 'long',
        type: 'float8',
        isNullable: true,
      },
      {
        name: 'fuel_level',
        type: 'int',
        default: 0,
      },
      {
        name: 'active',
        type: 'boolean',
        default: true,
        isNullable: false,
      },
      {
        name: 'created_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'updated_at',
        type: 'timestamp',
        default: 'CURRENT_TIMESTAMP',
      },
      {
        name: 'removed_at',
        type: 'timestamp',
        isNullable: true,
        default: null,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(this.table);

    await queryRunner.createForeignKey(
      this.table.name,
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'companies',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columns = await queryRunner.getTable(this.table.name);
    const foreignKeys = columns.foreignKeys.find((fk) =>
      fk.columnNames.includes('company_id'),
    );

    await queryRunner.dropForeignKey(this.table.name, foreignKeys);
    await queryRunner.dropTable(this.table);
  }
}
