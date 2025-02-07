import { Entity, Column } from 'typeorm';

import { AppEntity } from 'src/common/base/entities/app.entity';

@Entity('webhooks')
export class WebHookEntity extends AppEntity {
  @Column({ type: 'varchar', length: 255 })
  hook: string;

  @Column({ type: 'varchar', length: 255, name: 'delivery_url' })
  deliveryUrl: string;

  @Column({
    type: 'varchar',
    length: 7,
    nullable: true,
    name: 'delivery_type_request',
  })
  deliveryTypeRequest: string;

  @Column({
    type: 'varchar',
    length: 5,
    nullable: true,
    name: 'authorization_type',
  })
  authorizationType: string;

  @Column({ type: 'text', nullable: true, name: 'authorization_token' })
  authorizationToken: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'authorization_basic_username',
  })
  authorizationBasicUsername: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'authorization_basic_password',
  })
  authorizationBasicPassword: string;

  @Column({ type: 'json', nullable: true, name: 'payload_map' })
  payloadMap: object;
}
