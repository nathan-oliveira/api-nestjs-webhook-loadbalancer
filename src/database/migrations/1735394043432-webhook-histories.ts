import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class WebhookHistories1735394043432 implements MigrationInterface {
  private table = new Table({
    name: 'webhook_histories',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'webhook_id',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'payload',
        type: 'json',
        isNullable: true,
      },
      {
        name: 'status_code',
        type: 'int',
        isNullable: false,
      },
      {
        name: 'response_body',
        type: 'json',
        isNullable: true,
      },
      {
        name: 'request_sent',
        type: 'json',
        isNullable: true,
      },
      {
        name: 'expires',
        type: 'timestamp',
        isNullable: true,
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
        columnNames: ['webhook_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'webhooks',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const columns = await queryRunner.getTable(this.table.name);
    const foreignKeys = columns.foreignKeys.find((fk) =>
      fk.columnNames.includes('webhook_id'),
    );

    await queryRunner.dropForeignKey(this.table.name, foreignKeys);
    await queryRunner.dropTable(this.table);
  }
}
