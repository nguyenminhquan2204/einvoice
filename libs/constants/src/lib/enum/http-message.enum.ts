export enum HTTP_MESSAGE {
  OK = 'Ok',

  // Success
  SUCCESS = 'Success',
  CREATED = 'Created successfully',
  UPDATED = 'Updated successfully',
  DELETED = 'Deleted successfully',
  FETCHED = 'Data retrieved successfully',

  // Client Errors
  BAD_REQUEST = 'Bad request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  NOT_FOUND = 'Resource not found',
  METHOD_NOT_ALLOWED = 'Method not allowed',
  CONFLICT = 'Resource already exists',
  UNPROCESSABLE_ENTITY = 'Unprocessable entity',
  TOO_MANY_REQUESTS = 'Too many requests',

  // Server Errors
  INTERNAL_SERVER_ERROR = 'Internal server error',
  SERVICE_UNAVAILABLE = 'Service unavailable',
  GATEWAY_TIMEOUT = 'Gateway timeout',

  // Authentication
  INVALID_CREDENTIALS = 'Invalid email or password',
  TOKEN_EXPIRED = 'Token has expired',
  INVALID_TOKEN = 'Invalid token',
  ACCESS_DENIED = 'Access denied',

  // Validation
  VALIDATION_FAILED = 'Validation failed',
  REQUIRED_FIELD = 'Required field is missing',
  INVALID_INPUT = 'Invalid input',

  // File
  FILE_UPLOADED = 'File uploaded successfully',
  FILE_DELETED = 'File deleted successfully',
  FILE_NOT_FOUND = 'File not found',
  INVALID_FILE = 'Invalid file',

  // Database
  DATABASE_ERROR = 'Database error',
  DUPLICATE_RECORD = 'Duplicate record',
}
