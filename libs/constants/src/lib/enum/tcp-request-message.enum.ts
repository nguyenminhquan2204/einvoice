enum INVOICE {
  CREATE = 'invoice.create',
  UPDATE_BY_ID = 'invoice.update_by_id',
  GET_BY_ID = 'invoice.get_by_id',
  GET_ALL = 'invoice.get_all',
  DELETE_BY_ID = 'invoice.delete_by_id',
  SEND = 'invoice.send',
}

enum PRODUCT {
  CREATE = 'product.create',
  GET_LIST = 'product.get_list',
}

enum USER {
  CREATE = 'user.create',
  GET_ALL = 'user.get_all',
  GET_USER_BY_USER_ID = 'user.get_user_by_user_id',
}

enum KEYCLOAK {
  CREATE_USER = 'keycloack.create_user',
}

enum AUTHORIZER {
  LOGIN = 'authorizer.login',
  VERIFY_TOKEN_USER = 'authorizer.verify_user_token',
}

enum PDF_GENERATOR {
  CREATE_INVOICE_PDF = 'pdf_generator.create_invoice_pdf',
}

enum MEDIA {
  UPLOAD_FILE = 'media.upload_file',
}

export const TCP_REQUEST_MESSAGE = {
  INVOICE,
  PRODUCT,
  USER,
  KEYCLOAK,
  AUTHORIZER,
  PDF_GENERATOR,
  MEDIA,
};
