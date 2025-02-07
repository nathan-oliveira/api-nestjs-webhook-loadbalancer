import { PartialType } from '@nestjs/swagger';

import { QueryParamsDto } from 'src/common/base/dtos/query-params.dto';

export class QueryVehicleDto extends PartialType(QueryParamsDto) {}
