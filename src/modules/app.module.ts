import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';

import OrmConfigFactory from 'src/config/orm.config';
import { I18nGlobalModule } from 'src/common/i18n/i18n-global.module';

import { CompaniesModule } from './companies/companies.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { VehiclesModule } from './vehicles/vehicles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: OrmConfigFactory,
    }),
    ScheduleModule.forRoot(),
    I18nGlobalModule,
    CompaniesModule,
    UsersModule,
    AuthModule,
    ProfileModule,
    VehiclesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
