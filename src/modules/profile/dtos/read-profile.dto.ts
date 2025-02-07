import { PartialType } from '@nestjs/swagger';

import { ReadUserDto } from 'src/modules/users/dtos';

export class ReadProfileDto extends PartialType(ReadUserDto) {}
