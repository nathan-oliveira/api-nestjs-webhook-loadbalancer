import { PartialType } from '@nestjs/swagger';

import { CompanyEntity } from 'src/modules/companies/entities/company.entity';

export class ReadCompanyDto extends PartialType(CompanyEntity) {}
