import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestApplicationOptions } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './modules/app.module';
import { AppInitializer } from './config/app.config';

async function bootstrap() {
  const configService = new ConfigService();
  const nodeEnvironment = configService.get<string>('NODE_ENV');
  const nestApplicationOptions = {
    logger: nodeEnvironment !== 'development' ? ['error'] : true,
  } as NestApplicationOptions;

  const nestApplication: NestExpressApplication = await NestFactory.create(
    AppModule,
    nestApplicationOptions,
  );

  const appInitializer = new AppInitializer(nestApplication, configService);
  appInitializer.initialize();
}

bootstrap();
