import { Response } from 'express';
import {
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Catch,
} from '@nestjs/common';

import { HttpExceptionDto } from './dtos/http-exception.dto';
import { getMessagePgError } from './get-type-postgresql';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpExceptionDto, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message =
      typeof exception.response !== 'object'
        ? exception.message
        : exception.response.message;

    if (exception.code && getMessagePgError[exception.code]) {
      const request = ctx.getRequest();
      const locationPostgres = `postgres.${exception.code}`;
      const messagePostgres = request.i18nService.translate(locationPostgres);
      if (messagePostgres !== locationPostgres) message = messagePostgres;
    }

    const statusCode = exception.status || HttpStatus.BAD_REQUEST;
    return response.status(statusCode).json({ statusCode, message });
  }
}
