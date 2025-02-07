import { ILike } from 'typeorm';

import { IServiceOptionsDto } from 'src/common/base/dtos/service-options.dto';

export const serializeConditions = (
  conditions: Array<object>,
  search: string,
  options: IServiceOptionsDto,
) => {
  const wheres: any = [{ removedAt: null }];
  const filters: any = [];

  if (conditions.length) conditions.forEach((item) => wheres.push(item));
  if (search && options && options.filters) {
    for (const filterValue of options.filters) {
      if (filterValue.includes('.')) {
        const [relation, column] = filterValue.split('.');

        filters.push({
          [relation]: {
            [column]: ILike(`%${search}%`),
          },
        });
      } else {
        filters.push({ [filterValue]: ILike(`%${search}%`) });
      }
    }
  }

  if (filters.length > 1) {
    return filters.map((filter) => {
      const whereCondition = Object.assign({}, ...wheres);
      return { ...filter, ...whereCondition };
    });
  }

  return Object.assign({}, ...wheres, ...filters);
};
