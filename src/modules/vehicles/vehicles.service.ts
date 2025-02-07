import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VehicleEntity } from './entities/vehicle.entity';
import { CreateVehicleDto, UpdateVehicleDto, ReadVehicleDto } from './dtos';

import { BaseService } from 'src/common/base/services/base.service';
import { CompaniesService } from 'src/modules/companies/companies.service';
import { I18nGlobalService } from 'src/common/i18n/i18n-global.service';
import { CallBackVehicleDto } from './dtos/callback-vehicle.dto';

@Injectable()
export class VehiclesService extends BaseService<VehicleEntity> {
  constructor(
    @InjectRepository(VehicleEntity)
    private readonly vehicleRepository: Repository<VehicleEntity>,
    private readonly companiesService: CompaniesService,
    private readonly i18nService: I18nGlobalService,
  ) {
    super(i18nService, vehicleRepository, {
      filters: ['license', 'vin'],
      relations: ['company'],
    });
  }

  async verifyVehicleExist(vin: string, companyId: number): Promise<void> {
    const vehicle = await this.vehicleRepository.findOne({
      where: { removedAt: null, companyId, vin },
    });

    if (vehicle)
      throw new ConflictException(
        this.i18n.translate('vehicle.alreadyRegistered'),
      );
  }

  async createVehicle(
    createVehicleDto: CreateVehicleDto,
    companyIdUser: number = null,
  ): Promise<ReadVehicleDto> {
    const { companyId, vin } = createVehicleDto;
    await this.companiesService.verifyCompanyExists(companyId ?? companyIdUser);
    await this.verifyVehicleExist(vin, companyId ?? companyIdUser);
    return this.create({
      ...createVehicleDto,
      companyId: companyId ?? companyIdUser,
    });
  }

  async updateVehicle(
    id: number,
    updateVehicleDto: UpdateVehicleDto,
  ): Promise<ReadVehicleDto> {
    if (updateVehicleDto.companyId)
      await this.companiesService.verifyCompanyExists(
        updateVehicleDto.companyId,
      );
    return this.update(id, updateVehicleDto);
  }

  async callbackUpdateVehicle(
    callBackVehicleDto: CallBackVehicleDto,
  ): Promise<ReadVehicleDto> {
    const { vin, latitude: lat, longitude: long } = callBackVehicleDto;
    const vehicle = await this.vehicleRepository.findOne({
      where: { vin, active: true, removedAt: null },
    });

    if (!vehicle)
      throw new NotFoundException(this.i18n.translate('vehicle.notFound'));

    return this.update(vehicle.id, { lat, long });
  }
}
