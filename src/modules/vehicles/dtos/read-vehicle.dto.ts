import { PartialType } from '@nestjs/swagger';

import { VehicleEntity } from 'src/modules/vehicles/entities/vehicle.entity';

export class ReadVehicleDto extends PartialType(VehicleEntity) {}
