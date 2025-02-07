import { Entity, Column } from 'typeorm';

import { AppEntity } from 'src/common/base/entities/app.entity';

@Entity('companies')
export class CompanyEntity extends AppEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  address: string;

  @Column({ type: 'varchar', length: 25 })
  phone: string;
}
