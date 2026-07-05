import { parseToken } from './string.util';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer';
import { MetaDataKeys } from '@common/constants/common.constant';

export function getAccessToken(req: any, keepBearer = false): string {
  const token = req.headers?.['authorization'];
  return keepBearer ? token : parseToken(token);
}

export function setUserData(request: any, userData?: AuthorizeResponse): void {
  request[MetaDataKeys.USER_DATA] = userData;
}
