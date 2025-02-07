import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CallBackVehicleDto {
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
  @IsNotEmpty()
  @Transform(({ value }) => (value ? Number(value) : value))
  @IsNumber()
  latitude: number;

  @ApiPropertyOptional({
    type: Number,
    example: -46.83815,
  })
  @IsNotEmpty()
  @Transform(({ value }) => (value ? Number(value) : value))
  @IsNumber()
  longitude: number;
}
