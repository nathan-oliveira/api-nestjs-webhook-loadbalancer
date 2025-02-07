import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AppEntity } from 'src/common/base/entities/app.entity';

import { WebHookEntity } from 'src/modules/webhooks/entities/webhook.entity';

@Entity('webhook_histories')
export class WebHookHistoryEntity extends AppEntity {
  @Column({ type: 'json', nullable: true })
  payload: object;

  @Column({ type: 'int', nullable: true, name: 'status_code' })
  statusCode: number;

  @Column({ type: 'json', nullable: true, name: 'response_body' })
  responseBody: object;

  @Column({ type: 'json', nullable: true, name: 'request_sent' })
  responseSent: object;

  @Column({ nullable: true })
  expires: Date;

  @Column({ name: 'webhook_id', type: 'int' })
  webhookId: number;

  @ManyToOne(() => WebHookEntity)
  @JoinColumn({ name: 'webhook_id' })
  webhook: string;
}
