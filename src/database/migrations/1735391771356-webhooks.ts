import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Webhooks1735391771356 implements MigrationInterface {
  private table = new Table({
    name: 'webhooks',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'hook',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'delivery_url',
        type: 'varchar',
        length: '255',
        isNullable: false,
      },
      {
        name: 'delivery_type_request',
        type: 'varchar',
        length: '7',
        isNullable: true,
      },
      {
        name: 'authorization_type',
        type: 'varchar',
        length: '5',
        isNullable: true,
      },
      {
        name: 'authorization_token',
        type: 'text',
        isNullable: true,
      },
      {
        name: 'authorization_basic_username',
        type: 'varchar',
        length: '255',
        isNullable: true,
      },
      {
        name: 'authorization_basic_password',
        type: 'varchar',
        length: '255',
        isNullable: true,
      },
      {
        name: 'payload_map',
        type: 'json',
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(this.table);
  }
}
