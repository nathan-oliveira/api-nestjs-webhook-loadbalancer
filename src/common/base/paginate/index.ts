import { FindManyOptions, Repository } from 'typeorm';

import { Pagination } from './interfaces/paginate.interface';

export async function paginate<TEntity>(
  repository: Repository<TEntity>,
  options: FindManyOptions,
): Promise<Pagination<TEntity>> {
  const currentPage = Number(options.skip || 1);
  const itemsPerPage = Number(options.take || 10);

  const promises = [
    new Promise<TEntity[]>((resolve) => {
      return resolve(
        repository.find({
          skip: itemsPerPage * (currentPage - 1),
          take: itemsPerPage,
          relations: options.relations ?? [],
          order: options.order ?? {},
          where: options.where,
        }),
      );
    }),
    new Promise<number>((resolve) => {
      return resolve(
        repository.count({
          where: options.where ?? {},
          relations: options.relations ?? [],
        }),
      );
    }),
  ];

  const [items, totalItems] = await Promise.all(promises);
  const totalPages = Math.ceil(Number(totalItems) / Number(options.take));

  return {
    items,
    meta: {
      totalItems,
      totalPages,
      currentPage,
      itemsPerPage,
    },
  } as Pagination<TEntity>;
}
