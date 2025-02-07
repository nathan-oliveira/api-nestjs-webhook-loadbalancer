enum EnumOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IOrderBy {
  column: string;
  order: EnumOrder;
}

/** Ex:
 * @param {object | string} value - { column: 'login', order: 'ASC' }
 * @param {object | string} value - { column: 'user.login', order: 'DESC' }
 * @returns {Object} - { title: 'DESC' }
 */
export const serializeOrderBy = (value: string | IOrderBy) => {
  if (value && typeof value === 'string') {
    const { column, order } = JSON.parse(value) as IOrderBy;
    if (!column.includes('.')) return orderByJson({ column, order });
    const [relation, columnRelation] = column.split('.');
    return {
      [relation]: { [columnRelation]: order.toUpperCase() },
    };
  }

  return orderByJson(value as IOrderBy);
};

const orderByJson = (value: IOrderBy) => ({
  [value.column]: value.order.toUpperCase(),
});
