import {
  Controller,
  ClassSerializerInterceptor,
  UseInterceptors,
  Body,
  Get,
  Put,
  Post,
  Patch,
  Delete,
  Res,
  Query,
} from '@nestjs/common';

import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiBody,
  ApiTags,
  ApiParam,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';

import { Rule } from 'src/modules/auth/enums/rule.enum';
import { JwtAuth } from 'src/modules/auth/decorators/jwt-auth.decorator';
import { ParamId } from 'src/modules/auth/decorators/param-id.decorator';

import {
  ReadUserDto,
  QueryUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './dtos';

import { UsersService } from './users.service';
import { UserAuth } from '../auth/decorators/user-auth.decorator';
import { LoginUserDto } from '../auth/dtos';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadUserDto })
  @ApiBody({ type: CreateUserDto })
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UserAuth() { companyId }: LoginUserDto,
  ) {
    const user = await this.usersService.createUser(createUserDto, companyId);
    return plainToClass(ReadUserDto, user);
  }

  @Get()
  @JwtAuth(Rule.USER, Rule.ADMIN)
  @ApiOkResponse({ type: [ReadUserDto] })
  async findAllUsers(
    @Res({ passthrough: true }) res: Response,
    @Query() queryUserDto: QueryUserDto,
  ): Promise<ReadUserDto[]> {
    const { items, meta } =
      await this.usersService.findByPaginate(queryUserDto);

    res.setHeader('X-Total-Items', meta.totalItems);
    return plainToClass(ReadUserDto, items);
  }

  @Get(':id')
  @JwtAuth(Rule.USER, Rule.ADMIN)
  @ApiOkResponse({ type: ReadUserDto })
  @ApiParam({ name: 'id', type: Number })
  async findOneUser(@ParamId() id: number): Promise<ReadUserDto> {
    const user = await this.usersService.findById(id);
    return plainToClass(ReadUserDto, user);
  }

  @Put(':id')
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadUserDto })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @ParamId() id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const user = await this.usersService.updateUser(id, updateUserDto);
    return plainToClass(ReadUserDto, user);
  }

  @Patch(':id')
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadUserDto })
  @ApiParam({ name: 'id', type: Number })
  async disableOrActivateUser(@ParamId() id: number): Promise<ReadUserDto> {
    const user = await this.usersService.disableOrActivate(id);
    return plainToClass(ReadUserDto, user);
  }

  @Delete(':id')
  @JwtAuth(Rule.ADMIN)
  @ApiNoContentResponse()
  @ApiParam({ name: 'id', type: Number })
  async removeUser(@ParamId() id: number): Promise<void> {
    await this.usersService.remove(id);
  }
}
