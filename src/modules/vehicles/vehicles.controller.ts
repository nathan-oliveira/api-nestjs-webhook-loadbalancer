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
  ApiOkResponse,
  ApiBody,
  ApiTags,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Response } from 'express';

import { Rule } from 'src/modules/auth/enums/rule.enum';
import { JwtAuth } from 'src/modules/auth/decorators/jwt-auth.decorator';
import { BasicAuth } from '../auth/decorators/basic-auth.decorator';
import { ParamId } from 'src/modules/auth/decorators/param-id.decorator';

import {
  ReadVehicleDto,
  QueryVehicleDto,
  CreateVehicleDto,
  UpdateVehicleDto,
} from './dtos';

import { VehiclesService } from './vehicles.service';
import { WebHooksInterceptor } from '../webhooks/webhooks.interceptor';
import { CallBackVehicleDto } from './dtos/callback-vehicle.dto';
import { LoginUserDto } from '../auth/dtos';
import { UserAuth } from '../auth/decorators/user-auth.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
@UseInterceptors(ClassSerializerInterceptor)
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post('/callback')
  @BasicAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadVehicleDto })
  @ApiBody({ type: CallBackVehicleDto })
  async routeCallbackVehicle(
    @Body() callBackVehicleDto: CallBackVehicleDto,
  ): Promise<ReadVehicleDto> {
    const vehicle =
      await this.vehiclesService.callbackUpdateVehicle(callBackVehicleDto);
    return plainToClass(ReadVehicleDto, vehicle);
  }

  @Post()
  @JwtAuth(Rule.ADMIN)
  @UseInterceptors(WebHooksInterceptor)
  @ApiOkResponse({ type: ReadVehicleDto })
  @ApiBody({ type: CreateVehicleDto })
  async createVehicle(
    @Body() createVehicleDto: CreateVehicleDto,
    @UserAuth() { companyId }: LoginUserDto,
  ) {
    const vehicle = await this.vehiclesService.createVehicle(
      createVehicleDto,
      companyId,
    );
    return plainToClass(ReadVehicleDto, vehicle);
  }

  @Get()
  @JwtAuth(Rule.USER, Rule.ADMIN)
  @ApiOkResponse({ type: [ReadVehicleDto] })
  @ApiQuery({ type: QueryVehicleDto })
  async findAllVehicles(
    @Res({ passthrough: true }) res: Response,
    @Query() queryVehicleDto: QueryVehicleDto,
  ): Promise<ReadVehicleDto[]> {
    const { items, meta } =
      await this.vehiclesService.findByPaginate(queryVehicleDto);

    res.setHeader('X-Total-Items', meta.totalItems);
    return plainToClass(ReadVehicleDto, items);
  }

  @Get(':id')
  @JwtAuth(Rule.USER, Rule.ADMIN)
  @ApiOkResponse({ type: ReadVehicleDto })
  @ApiParam({ name: 'id', type: Number })
  async findOneVehicle(@ParamId() id: number): Promise<ReadVehicleDto> {
    const vehicle = await this.vehiclesService.findById(id);
    return plainToClass(ReadVehicleDto, vehicle);
  }

  @Put(':id')
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadVehicleDto })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateVehicleDto })
  async updateVehicle(
    @ParamId() id: number,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ): Promise<ReadVehicleDto> {
    const vehicle = await this.vehiclesService.updateVehicle(
      id,
      updateVehicleDto,
    );
    return plainToClass(ReadVehicleDto, vehicle);
  }

  @Patch(':id')
  @JwtAuth(Rule.ADMIN)
  @ApiOkResponse({ type: ReadVehicleDto })
  @ApiParam({ name: 'id', type: Number })
  async disableOrActivateVehicle(
    @ParamId() id: number,
  ): Promise<ReadVehicleDto> {
    const vehicle = await this.vehiclesService.disableOrActivate(id);
    return plainToClass(ReadVehicleDto, vehicle);
  }

  @Delete(':id')
  @JwtAuth(Rule.ADMIN)
  @UseInterceptors(WebHooksInterceptor)
  @ApiOkResponse({ type: ReadVehicleDto })
  @ApiParam({ name: 'id', type: Number })
  async removeVehicle(@ParamId() id: number): Promise<ReadVehicleDto> {
    const vehicleRemoved = await this.vehiclesService.remove(id);
    return plainToClass(ReadVehicleDto, vehicleRemoved);
  }
}
