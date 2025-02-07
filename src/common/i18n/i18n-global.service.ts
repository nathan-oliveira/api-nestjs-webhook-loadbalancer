import { Injectable } from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class I18nGlobalService {
  constructor(private readonly i18nService: I18nService) {}

  translate(key: string): Promise<string> {
    const lang = I18nContext.current().lang;
    return this.i18nService.translate(key, { lang });
  }
}
