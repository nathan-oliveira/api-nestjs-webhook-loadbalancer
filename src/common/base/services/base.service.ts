import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, DeepPartial, FindOptionsWhere } from 'typeorm';

import { AppEntity } from 'src/common/base/entities/app.entity';
import { IBaseService } from 'src/common/base/services/interfaces/base.interface';
import { I18nGlobalService } from 'src/common/i18n/i18n-global.service';

import { QueryParamsDto } from 'src/common/base/dtos/query-params.dto';
import { IServiceOptionsDto } from 'src/common/base/dtos/service-options.dto';

import { serializeOrderBy } from 'src/common/base/utils/serialize-order-by';
import { serializeConditions } from 'src/common/base/utils/serialize-conditions';

import { Pagination } from 'src/common/base/paginate/interfaces/paginate.interface';
import { paginate } from 'src/common/base/paginate';

@Injectable()
export abstract class BaseService<TEntity extends AppEntity>
  implements IBaseService
{
  constructor(
    readonly i18n: I18nGlobalService,
    readonly repository: Repository<TEntity>,
    readonly options: IServiceOptionsDto = null,
  ) {}

  async findByPaginate(
    queryParams: QueryParamsDto,
    conditions: Array<object> = [],
  ): Promise<Pagination<TEntity>> {
    const { page, limit, search, orderBy, active } = queryParams;
    const options = {};

    if (orderBy) options['order'] = serializeOrderBy(orderBy);
    if (this.options && this.options.relations) {
      options['relations'] = this.options.relations;
    }

    if (typeof active === 'boolean') conditions.push({ active });
    const where = serializeConditions(conditions, search, this.options);

    if (where) options['where'] = where;
    if (page) options['skip'] = page;
    if (limit) options['take'] = limit;

    return paginate<TEntity>(this.repository, options);
  }

  async findAll(): Promise<TEntity[]> {
    const options = { where: { removedAt: null } };
    if (this.options && this.options.relations)
      options['relations'] = this.options.relations;
    return await this.repository.find(options);
  }

  async findById(id: number): Promise<TEntity> {
    const options = {
      where: { id, removedAt: null } as FindOptionsWhere<TEntity>,
    };

    if (this.options && this.options.relations)
      options['relations'] = this.options.relations;

    const resultEntity = await this.repository.findOne(options);
    if (!resultEntity)
      throw new NotFoundException(this.i18n.translate('base.registerNotFound'));

    return resultEntity;
  }

  async findByField(field: string, value: string | number): Promise<TEntity[]> {
    const options = { where: { removedAt: null, [field]: value } };
    if (this.options && this.options.relations)
      options['relations'] = this.options.relations;
    return await this.repository.find(options);
  }

  async create(createEntityDto: DeepPartial<TEntity>): Promise<TEntity> {
    const preloadEntity = this.repository.create(createEntityDto);
    return await this.repository.save(preloadEntity);
  }

  async update(
    id: number,
    updateEntityDto: DeepPartial<TEntity>,
  ): Promise<TEntity> {
    const preloadUpdateEntity = (await this.repository.preload({
      ...updateEntityDto,
      id,
    })) as DeepPartial<TEntity>;

    if (!preloadUpdateEntity) {
      throw new NotFoundException(this.i18n.translate('base.registerNotFound'));
    }

    return await this.repository.save(preloadUpdateEntity);
  }

  async remove(id: number): Promise<TEntity> {
    const resultEntity = (await this.findById(id)) as DeepPartial<TEntity>;
    resultEntity.removedAt = new Date();
    resultEntity.active = false;
    return this.repository.save(resultEntity);
  }

  async disableOrActivate(id: number): Promise<TEntity> {
    const resultEntity = (await this.findById(id)) as DeepPartial<TEntity>;
    resultEntity.active = !resultEntity.active;
    return this.repository.save(resultEntity);
  }
}
