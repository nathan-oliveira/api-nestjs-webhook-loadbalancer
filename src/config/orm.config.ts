import { ConfigService } from '@nestjs/config';
import { join } from 'path';

export default (configService: ConfigService) => ({
  type: configService.get('DATABASE_TYPE'),
  host: configService.get('DATABASE_HOST'),
  port: Number(configService.get('DATABASE_PORT')),
  username: configService.get('DATABASE_USERNAME'),
  password: configService.get('DATABASE_PASSWORD'),
  database: configService.get('DATABASE_NAME'),
  schema: configService.get('DATABASE_NAME_SCHEMA'),
  synchronize: false,
  migrationsRun: true,
  autoLoadEntities: true,
  logging: false,
  entities: [join(__dirname, '../modules/**/*.entity{.ts,.js}')],
  migrations: [join(__dirname, '../database/migrations/*{.ts,.js}')],
});
