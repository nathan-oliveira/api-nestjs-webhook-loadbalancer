import { PartialType } from '@nestjs/swagger';

import { UpdateUserDto } from 'src/modules/users/dtos';

export class UpdateProfileDto extends PartialType(UpdateUserDto) {}
