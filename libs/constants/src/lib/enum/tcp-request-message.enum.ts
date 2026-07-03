enum INVOICE {
  CREATE = 'invoice.create',
  UPDATE_BY_ID = 'invoice.update_by_id',
  GET_BY_ID = 'invoice.get_by_id',
  GET_ALL = 'invoice.get_all',
  DELETE_BY_ID = 'invoice.delete_by_id',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_LIST = 'product.get_list',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
};
