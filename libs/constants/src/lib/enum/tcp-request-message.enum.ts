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

enum USER {
  CREATE = 'user.create',
  GET_ALL = 'user.get_all',
}

enum KEYCLOAK {
  CREATE_USER = 'keycloack.create_user',
}

enum AUTHORIZER {
  LOGIN = 'authorizer.login',
  VERIFY_TOKEN_USER = 'authorizer.verify_user_token',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
  USER,
  KEYCLOAK,
  AUTHORIZER,
};
