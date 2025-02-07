import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVehicleDto {
  @ApiProperty({
    type: String,
    example: 'AB1234567CD',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(25)
  license: string;

  @ApiProperty({
    type: String,
    example: '1HGCM82633A123456',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(300)
  vin: string;

  @ApiPropertyOptional({
    type: Number,
    example: -23.507399,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : value))
  @IsNumber()
  lat: number;

  @ApiPropertyOptional({
    type: Number,
    example: -46.83815,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : value))
  @IsNumber()
  long: number;

  @ApiPropertyOptional({
    type: Number,
    example: 10,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : value))
  @IsNumber()
  fuelLevel: number;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  companyId: number;
}
