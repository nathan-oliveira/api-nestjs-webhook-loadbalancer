import { MigrationInterface, QueryRunner } from 'typeorm';
import { queryRunnerSeed } from '../seeds/utils';

export class Seeds1735419713219 implements MigrationInterface {
  private companySeeds = {
    seed: '1735319201180-initial-company',
    table: 'companies',
  };

  private userSeeds = {
    seed: '1735319201180-initial-user',
    table: 'users',
  };

  private webhookSeeds = {
    seed: '1735514370089-webhook',
    table: 'webhooks',
  };

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunnerSeed(queryRunner, 'up', this.companySeeds, 2);
    await queryRunnerSeed(queryRunner, 'up', this.userSeeds, 2);
    await queryRunnerSeed(queryRunner, 'up', this.webhookSeeds, 5);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunnerSeed(queryRunner, 'down', this.userSeeds, 1);
    await queryRunnerSeed(queryRunner, 'down', this.companySeeds, 1);
    await queryRunnerSeed(queryRunner, 'down', this.webhookSeeds, 1);
  }
}
