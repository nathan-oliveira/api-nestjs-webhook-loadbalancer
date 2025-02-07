import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';

import { BaseService } from 'src/common/base/services/base.service';
import { I18nGlobalService } from 'src/common/i18n/i18n-global.service';
import { WebHookEventEntity } from './entities/webhook-event.entity';
import { ReadWebHookEventDto } from './dtos';

@Injectable()
export class WebHookEventsService extends BaseService<WebHookEventEntity> {
  constructor(
    @InjectRepository(WebHookEventEntity)
    private readonly webHookEventRepository: Repository<WebHookEventEntity>,
    private readonly i18nService: I18nGlobalService,
  ) {
    super(i18nService, webHookEventRepository, {
      relations: ['webhook'],
    });
  }

  async createWebHookEvent(
    webhookId: number,
    payload: object,
    urlParams: object = null,
  ): Promise<ReadWebHookEventDto> {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    return this.create({ webhookId, payload, expires, urlParams });
  }

  async findWebHookEventNotSent(): Promise<ReadWebHookEventDto[]> {
    return this.webHookEventRepository.find({
      where: {
        expires: MoreThanOrEqual(new Date()),
        removedAt: null,
        active: true,
      },
      relations: ['webhook'],
    });
  }
}
