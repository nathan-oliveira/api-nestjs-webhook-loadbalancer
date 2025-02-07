import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WebHookEventEntity } from './entities/webhook-event.entity';
import { WebHookEventsService } from './webhook-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebHookEventEntity])],
  controllers: [],
  providers: [WebHookEventsService],
  exports: [WebHookEventsService],
})
export class WebHookEventsModule {}
