import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './entities/user.entity';
import { CreateUserDto, ReadUserDto, UpdateUserDto } from './dtos';

import { BaseService } from 'src/common/base/services/base.service';
import { I18nGlobalService } from 'src/common/i18n/i18n-global.service';
import { CompaniesService } from 'src/modules/companies/companies.service';
import { convertToHash } from 'src/common/bcrypt';

@Injectable()
export class UsersService extends BaseService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly i18nService: I18nGlobalService,
    private readonly companiesService: CompaniesService,
  ) {
    super(i18nService, userRepository, {
      filters: ['name'],
      relations: ['company'],
    });
  }

  async createUser(
    createUserDto: CreateUserDto,
    companyIdUser: number = null,
  ): Promise<ReadUserDto> {
    const userIsRegistered = await this.userRepository.findOne({
      where: { login: createUserDto.login },
    });

    if (userIsRegistered)
      throw new HttpException(
        this.i18n.translate('user.alreadyRegistered'),
        HttpStatus.CONFLICT,
      );

    await this.companiesService.verifyCompanyExists(createUserDto.companyId);
    const password = await convertToHash(createUserDto.password);
    const companyId = createUserDto.companyId ?? companyIdUser;
    return this.create({ ...createUserDto, password, companyId });
  }

  async updateUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ReadUserDto> {
    const user = await this.userRepository.preload({ ...updateUserDto, id });

    if (!user)
      throw new NotFoundException(this.i18n.translate('user.userNotFound'));
    if (updateUserDto.companyId)
      await this.companiesService.verifyCompanyExists(updateUserDto.companyId);

    if (updateUserDto.password)
      user.password = await convertToHash(updateUserDto.password);

    return this.userRepository.save(user);
  }

  async findUserByLogin(login: string): Promise<ReadUserDto> {
    return this.userRepository.findOne({
      where: { login, removedAt: null },
      relations: ['company'],
    });
  }
}
