interface ObjectLiteral {
  [s: string]: any;
}

export interface IPaginationMeta extends ObjectLiteral {
  totalItems?: number;
  totalPages?: number;
  currentPage?: number;
  itemsPerPage?: number;
}

export interface Pagination<PaginationObject> extends ObjectLiteral {
  items: PaginationObject[];
  meta: IPaginationMeta;
}
