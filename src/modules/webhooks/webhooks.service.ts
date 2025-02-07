import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { BaseService } from 'src/common/base/services/base.service';
import { I18nGlobalService } from 'src/common/i18n/i18n-global.service';

import { WebHookEventsService } from '../webhook-events/webhook-events.service';
import { WebHookHistoriesService } from '../webhook-histories/webhook-histories.service';
import { WebHookEntity } from './entities/webhook.entity';
import { getWebHookUrl, getWebHookNormalizePayload } from './shared';
import { ReadWebHookDto, TWebHookEvent, TWebHookInterceptor } from './dtos';

@Injectable()
export class WebHooksService extends BaseService<WebHookEntity> {
  constructor(
    @InjectRepository(WebHookEntity)
    private readonly webHookRepository: Repository<WebHookEntity>,

    private readonly i18nService: I18nGlobalService,
    private readonly webHookEventsService: WebHookEventsService,
    private readonly webHookHistoriesService: WebHookHistoriesService,

    private readonly httpService: HttpService,
  ) {
    super(i18nService, webHookRepository, {
      relations: ['company'],
    });
  }

  async emitWebHook(dataToInterceptor: TWebHookInterceptor): Promise<void> {
    const { hook, payload, method, urlParams } = dataToInterceptor;

    const webHook = await this.webHookRepository.findOne({
      where: {
        hook,
        deliveryTypeRequest: method.toLocaleUpperCase(),
        removedAt: null,
        active: true,
      },
    });

    if (!webHook) return;

    const eventPayload = await getWebHookNormalizePayload(
      hook,
      webHook.payloadMap,
      payload,
    );

    const { id: eventId } = await this.webHookEventsService.createWebHookEvent(
      webHook.id,
      eventPayload,
      urlParams,
    );

    await this.emitWebHookEvent(webHook, { eventPayload, eventId, urlParams });
  }

  async emitWebHookEvent(webHook: ReadWebHookDto, event: TWebHookEvent) {
    const httpMethod = webHook.deliveryTypeRequest.toLocaleLowerCase();
    const httpUrl = getWebHookUrl(webHook.deliveryUrl, event?.urlParams);

    try {
      const httpResult: any = await firstValueFrom(
        this.httpService[httpMethod](httpUrl, event.eventPayload),
      );

      await this.webHookHistoriesService.createWebHookHistory(
        webHook,
        event.eventPayload,
        httpResult,
      );

      if (httpResult.status === 200 || httpResult.status === 201)
        await this.webHookEventsService.remove(event.eventId);
    } catch (error) {
      const httpResult = {
        status: error?.status || HttpStatus.SERVICE_UNAVAILABLE,
        config: error?.config,
        data: error?.response?.data || {
          data: this.i18nService.translate('webhook.apiInaccessible'),
        },
      };

      await this.webHookHistoriesService.createWebHookHistory(
        webHook,
        event.eventPayload,
        httpResult,
      );
    }
  }
}
