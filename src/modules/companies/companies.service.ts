import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BaseService } from 'src/common/base/services/base.service';
import { CompanyEntity } from './entities/company.entity';
import { I18nGlobalService } from 'src/common/i18n/i18n-global.service';

@Injectable()
export class CompaniesService extends BaseService<CompanyEntity> {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    private readonly i18nService: I18nGlobalService,
  ) {
    super(i18nService, companyRepository, {
      filters: ['name'],
    });
  }

  async verifyCompanyExists(id: number): Promise<void> {
    const company = await this.companyRepository.findOne({
      where: { id, removedAt: null },
    });

    if (!company)
      throw new NotFoundException(this.i18n.translate('company.notFound'));
  }
}
