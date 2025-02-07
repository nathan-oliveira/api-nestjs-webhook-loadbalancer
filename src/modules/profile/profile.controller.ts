import {
  Body,
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Get,
  Put,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ApiOkResponse, ApiBody, ApiTags } from '@nestjs/swagger';

import { Rule } from 'src/modules/auth/enums/rule.enum';
import { JwtAuth } from 'src/modules/auth/decorators/jwt-auth.decorator';
import { UserAuth } from 'src/modules/auth/decorators/user-auth.decorator';

import { LoginUserDto } from 'src/modules/auth/dtos';
import { UsersService } from 'src/modules/users/users.service';

import { ReadProfileDto, UpdateProfileDto } from './dtos';

@ApiTags('Profile')
@JwtAuth(Rule.USER, Rule.ADMIN)
@Controller('profile')
@UseInterceptors(ClassSerializerInterceptor)
export class ProfileController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOkResponse({ type: ReadProfileDto })
  async profile(@UserAuth() { id }: LoginUserDto): Promise<ReadProfileDto> {
    const user = await this.usersService.findById(id);
    return plainToClass(ReadProfileDto, user);
  }

  @Put()
  @ApiOkResponse({ type: ReadProfileDto })
  @ApiBody({ type: UpdateProfileDto })
  async update(
    @UserAuth() { id }: LoginUserDto,
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<ReadProfileDto> {
    const profile = await this.usersService.updateUser(id, updateProfileDto);
    return plainToClass(ReadProfileDto, profile);
  }
}
