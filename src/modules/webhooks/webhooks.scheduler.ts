import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';

import { WebHookEventsService } from '../webhook-events/webhook-events.service';
import { WebHooksService } from './webhooks.service';
import { plainToClass } from 'class-transformer';
import { ReadWebHookDto } from './dtos';
import { writeLogError } from 'src/common/base/logger';

@Injectable()
export class WebHooksScheduler {
  constructor(
    private readonly configService: ConfigService,
    private readonly webHookEventsService: WebHookEventsService,
    private readonly webHooksService: WebHooksService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async resendingWebhookEvents() {
    const instance = Number(this.configService.get('NODE_APP_INSTANCE') || 0);
    if (instance !== 0) return;

    try {
      const events = await this.webHookEventsService.findWebHookEventNotSent();
      for (const event of events) {
        const webhook = plainToClass(ReadWebHookDto, event.webhook);
        await this.webHooksService.emitWebHookEvent(webhook, {
          eventPayload: event.payload,
          eventId: event.id,
          urlParams: event.urlParams,
        });
      }
    } catch (error) {
      writeLogError(WebHooksScheduler.name, error);
    }
  }
}
