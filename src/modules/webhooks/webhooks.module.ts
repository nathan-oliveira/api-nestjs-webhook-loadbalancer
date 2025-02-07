import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { WebHookEventsModule } from '../webhook-events/webhook-events.module';
import { WebHookHistoriesModule } from '../webhook-histories/webhook-histories.module';

import { WebHookEntity } from './entities/webhook.entity';
import { WebHooksService } from './webhooks.service';
import { WebHooksScheduler } from './webhooks.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([WebHookEntity]),
    HttpModule,
    WebHookEventsModule,
    WebHookHistoriesModule,
  ],
  controllers: [],
  providers: [WebHooksService, WebHooksScheduler],
  exports: [WebHooksService],
})
export class WebHooksModule {}
