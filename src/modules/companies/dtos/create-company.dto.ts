import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({
    type: String,
    example: 'Ituran Mob',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    type: String,
    example: 'Rua exemplo, 123, Bairro, CEP 98765-432, São Paulo, SP, Brasil',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  address: string;

  @ApiProperty({
    type: String,
    example: '+55 11 99999-9999',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  phone: string;
}
