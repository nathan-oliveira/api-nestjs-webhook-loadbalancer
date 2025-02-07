import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/common/base/services/base.service';
import { WebHookHistoryEntity } from './entities/webhook-history.entity';
import { I18nGlobalService } from 'src/common/i18n/i18n-global.service';

import { WebHookEntity } from '../webhooks/entities/webhook.entity';
import { ReadWebHookHistoryDto } from './dtos';

@Injectable()
export class WebHookHistoriesService extends BaseService<WebHookHistoryEntity> {
  constructor(
    @InjectRepository(WebHookHistoryEntity)
    private readonly webHookHistoryRepository: Repository<WebHookHistoryEntity>,
    private readonly i18nService: I18nGlobalService,
  ) {
    super(i18nService, webHookHistoryRepository, {
      relations: ['webhook'],
    });
  }

  async createWebHookHistory(
    webhook: Partial<WebHookEntity>,
    payload: object,
    httpResult: any,
  ): Promise<ReadWebHookHistoryDto> {
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    return this.create({
      webhookId: webhook.id,
      payload,
      expires,
      statusCode: httpResult?.status,
      responseBody: { data: httpResult?.data },
      responseSent: {
        url: httpResult?.config?.url,
        body: httpResult?.config?.data,
        method: httpResult?.config?.method,
        headers: httpResult?.config?.headers,
        status: httpResult?.status,
      },
    });
  }
}
