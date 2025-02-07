import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AppEntity } from 'src/common/base/entities/app.entity';
import { CompanyEntity } from 'src/modules/companies/entities/company.entity';

@Entity('vehicles')
export class VehicleEntity extends AppEntity {
  @Column({ type: 'varchar', length: 25 })
  license: string;

  @Column({ type: 'varchar', length: 300 })
  vin: string;

  @Column({ type: 'float8', nullable: true })
  lat: number;

  @Column({ type: 'float8', nullable: true })
  long: number;

  @Column({ type: 'int', name: 'fuel_level', default: 0 })
  fuelLevel: number;

  @Column({ name: 'company_id', type: 'int' })
  companyId: number;

  @ManyToOne(() => CompanyEntity)
  @JoinColumn({ name: 'company_id' })
  company: string;
}
