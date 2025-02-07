import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

import { AppEntity } from 'src/common/base/entities/app.entity';

import { WebHookEntity } from 'src/modules/webhooks/entities/webhook.entity';

@Entity('webhook_events')
export class WebHookEventEntity extends AppEntity {
  @Column({ type: 'json', nullable: true })
  payload: object;

  @Column({ nullable: true })
  expires: Date;

  @Column({ type: 'json', nullable: true, name: 'url_params' })
  urlParams: object;

  @Column({ name: 'webhook_id', type: 'int' })
  webhookId: number;

  @ManyToOne(() => WebHookEntity)
  @JoinColumn({ name: 'webhook_id' })
  webhook: string;
}
