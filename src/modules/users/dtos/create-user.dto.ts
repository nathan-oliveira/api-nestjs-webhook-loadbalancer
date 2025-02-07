import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'Bobby Charlton',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    type: String,
    example: 'bobby',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  login: string;

  @ApiProperty({
    type: String,
    example: 'b0bby1223',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  password: string;

  @ApiPropertyOptional({
    type: Number,
    example: 1,
  })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  rule?: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  companyId: number;
}
