import { PartialType } from '@nestjs/swagger';

import { WebHookEntity } from '../entities/webhook.entity';

export class ReadWebHookDto extends PartialType(WebHookEntity) {}
