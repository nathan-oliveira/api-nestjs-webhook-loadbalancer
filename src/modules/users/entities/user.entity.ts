import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AppEntity } from 'src/common/base/entities/app.entity';
import { CompanyEntity } from 'src/modules/companies/entities/company.entity';

@Entity('users')
export class UserEntity extends AppEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  login: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ default: 1 })
  rule: number;

  @Column({ name: 'company_id', type: 'int' })
  companyId: number;

  @ManyToOne(() => CompanyEntity)
  @JoinColumn({ name: 'company_id' })
  company: string;
}
