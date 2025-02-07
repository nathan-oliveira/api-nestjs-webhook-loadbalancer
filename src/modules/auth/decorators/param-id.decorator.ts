import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { I18nService } from 'nestjs-i18n';

export const validateId = (id: string, i18n: I18nService) => {
  if (Number.isNaN(Number(id))) {
    throw new HttpException(
      i18n.translate('base.identificationInvalid'),
      HttpStatus.BAD_REQUEST,
    );
  }

  return Number(id);
};

export const ParamId = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const id = request.params.id;
    const i18n: I18nService = request.i18nService;
    return validateId(id, i18n);
  },
);
