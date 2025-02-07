import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as env from 'dotenv';

import OrmConfigFactory from 'src/config/orm.config';

const configService = new ConfigService({ env: env.config() });
const ormConfig = OrmConfigFactory(configService);
delete ormConfig.autoLoadEntities;

export default new DataSource(ormConfig);
