import { PartialType } from '@nestjs/swagger';

import { ReadUserDto } from 'src/modules/users/dtos';

export class ReadAuthDto extends PartialType(ReadUserDto) {}
