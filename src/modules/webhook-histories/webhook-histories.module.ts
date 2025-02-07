import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WebHookHistoryEntity } from './entities/webhook-history.entity';
import { WebHookHistoriesService } from './webhook-histories.service';

@Module({
  imports: [TypeOrmModule.forFeature([WebHookHistoryEntity])],
  controllers: [],
  providers: [WebHookHistoriesService],
  exports: [WebHookHistoriesService],
})
export class WebHookHistoriesModule {}
