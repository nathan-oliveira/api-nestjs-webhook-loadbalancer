import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';

import { Observable, tap } from 'rxjs';
import { ConfigService } from '@nestjs/config';

import { WebHooksService } from './webhooks.service';
import { getWebHookPayload, getWebHookParams } from './shared';
import { writeLogError } from 'src/common/base/logger';

@Injectable()
export class WebHooksInterceptor implements NestInterceptor {
  constructor(
    private readonly webHooksService: WebHooksService,
    private readonly configService: ConfigService,
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const { method } = context.switchToHttp().getRequest();
    const className = context.getClass().name;
    const methodName = context.getHandler().name;
    const hook = `${className}.${methodName}`;

    return next.handle().pipe(
      tap(async (response) => {
        try {
          const payload = getWebHookPayload(this.configService, hook, response);
          const urlParams = getWebHookParams(hook, response);
          await this.webHooksService.emitWebHook({
            hook,
            method,
            payload,
            urlParams,
          });
        } catch (error) {
          writeLogError(WebHooksInterceptor.name, error);
        }
      }),
    );
  }
}
