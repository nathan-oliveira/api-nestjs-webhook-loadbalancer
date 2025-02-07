import { PartialType } from '@nestjs/swagger';

import { WebHookEventEntity } from '../entities/webhook-event.entity';

export class ReadWebHookEventDto extends PartialType(WebHookEventEntity) {}
