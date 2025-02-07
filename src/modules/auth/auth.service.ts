import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { I18nGlobalService } from 'src/common/i18n/i18n-global.service';
import { UsersService } from 'src/modules/users/users.service';

import { compareHash } from 'src/common/bcrypt';

import {
  ValidateUserDto,
  CreateAuthDto,
  LoginUserDto,
  ReadLoginUserDto,
} from 'src/modules/auth/dtos';

import { CreateUserDto, ReadUserDto } from 'src/modules/users/dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly i18n: I18nGlobalService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    login: string,
    password: string,
  ): Promise<ValidateUserDto> {
    const user: any = await this.usersService.findUserByLogin(login);

    if (!user) {
      throw new HttpException(
        this.i18n.translate('auth.invalidLogin'),
        HttpStatus.FORBIDDEN,
      );
    }

    const passwordIsValid = await compareHash(password, user.password);
    if (!passwordIsValid) {
      throw new HttpException(
        this.i18n.translate('auth.invalidLogin'),
        HttpStatus.FORBIDDEN,
      );
    }

    if (!user.company.active) {
      throw new HttpException(
        this.i18n.translate('company.disabledCompany'),
        HttpStatus.FORBIDDEN,
      );
    }

    if (!user.active) {
      throw new HttpException(
        this.i18n.translate('auth.disabledUser'),
        HttpStatus.FORBIDDEN,
      );
    }

    const { id, name, rule, active, companyId } = user;
    return { id, name, rule, active, companyId };
  }

  async userIsDisabled(id: number): Promise<void | boolean> {
    const user: any = await this.usersService.findById(id);
    return !user.active || !user.company.active;
  }

  async create(createAuthDto: CreateAuthDto): Promise<ReadUserDto> {
    const user = { ...createAuthDto, rule: 1 } as CreateUserDto;
    return this.usersService.createUser(user);
  }

  async login(loginUserDto: LoginUserDto): Promise<ReadLoginUserDto> {
    const { id: userId, rule, active, companyId } = loginUserDto;

    const token = this.jwtService.sign({ sub: userId, rule, active });
    const { exp: expirationTime } = this.jwtService.verify(token);

    const login = {
      token,
      userId,
      companyId,
      active,
      rule,
      expirationTime,
    };

    return login;
  }
}
