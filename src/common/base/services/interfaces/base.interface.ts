import { DeepPartial } from 'typeorm';

import { AppEntity } from 'src/common/base/entities/app.entity';
import { QueryParamsDto } from 'src/common/base/dtos/query-params.dto';
import { Pagination } from 'src/common/base/paginate/interfaces/paginate.interface';

export interface IBaseService {
  findByPaginate: (
    queryParams: QueryParamsDto,
    conditions?: Array<object>,
  ) => Promise<Pagination<AppEntity>>;

  findAll: () => Promise<AppEntity[]>;

  findById: (id: number) => Promise<AppEntity>;

  findByField: (field: string, value: string | number) => Promise<AppEntity[]>;

  create: (createEntityDto: DeepPartial<AppEntity>) => Promise<AppEntity>;

  update: (
    id: number,
    updateEntityDto: DeepPartial<AppEntity>,
  ) => Promise<AppEntity>;

  remove: (id: number) => Promise<AppEntity>;

  disableOrActivate(id: number): Promise<AppEntity>;
}
