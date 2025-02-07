import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

import { IOrderBy } from 'src/common/base/utils/serialize-order-by';

export class QueryParamsDto {
  @ApiProperty({
    name: 'search',
    description: 'Filter query parameter for table',
    type: String,
    required: false,
  })
  @IsOptional()
  search?: string;

  @ApiProperty({
    name: 'page',
    description: 'Defines the number of items to be skipped',
    type: Number,
    required: false,
  })
  @IsOptional()
  page?: number;

  @ApiProperty({
    name: 'limit',
    description: 'Sets the maximum items per page [1 ~ 96]',
    type: Number,
    required: false,
  })
  @IsOptional()
  limit?: number;

  @ApiProperty({
    name: 'orderBy',
    description: 'Ordering table fields',
    type: Object,
    required: false,
  })
  @IsOptional()
  orderBy?: string | IOrderBy;

  @ApiProperty({
    name: 'Active',
    description: 'Period Execution between two dates',
    type: [String],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  active?: boolean;
}
