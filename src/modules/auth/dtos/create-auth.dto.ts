import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAuthDto {
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

  @ApiProperty({
    type: Number,
    example: 1,
  })
  @Transform(({ value }) => Number(value))
  @IsNotEmpty()
  companyId: number;
}
