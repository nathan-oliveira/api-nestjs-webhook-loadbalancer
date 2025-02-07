import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { ApiTags, ApiBody, ApiOkResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { UserAuth } from 'src/modules/auth/decorators/user-auth.decorator';

import {
  CreateAuthDto,
  LoginUserDto,
  ReadAuthDto,
  ReadLoginUserDto,
} from './dtos';

import { LocalAuthGuard } from './guard/local/local-auth.guard';

import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @ApiOkResponse({ type: ReadAuthDto })
  @ApiBody({ type: CreateAuthDto })
  async createCommonUser(
    @Body() createAuthDto: CreateAuthDto,
  ): Promise<ReadAuthDto> {
    const user = await this.authService.create(createAuthDto);
    return plainToClass(ReadAuthDto, user);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  async login(
    @UserAuth() loginUserDto: LoginUserDto,
  ): Promise<ReadLoginUserDto> {
    const login = await this.authService.login(loginUserDto);
    return plainToClass(ReadLoginUserDto, login);
  }
}
