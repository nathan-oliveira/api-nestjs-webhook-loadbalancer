import { PartialType } from '@nestjs/swagger';

import { WebHookHistoryEntity } from '../entities/webhook-history.entity';

export class ReadWebHookHistoryDto extends PartialType(WebHookHistoryEntity) {}
