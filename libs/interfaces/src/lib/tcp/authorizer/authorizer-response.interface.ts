import { User } from '@common/schemas/user.schema';
import { LoginResponseDto } from '../../gateway/authorize';
import { PERMISSION } from '@common/constants/enum/role.enum';
import { JwtPayload } from 'jsonwebtoken';

export type LoginTcpResponse = LoginResponseDto;

export class AuthorizeMetadata {
  userId: string | null | undefined;
  user: User | null | undefined;
  permissions: PERMISSION[] | undefined;
  jwt: JwtPayload | undefined;

  constructor(payload?: Partial<AuthorizeMetadata>) {
    Object.assign(this, payload);
  }
}

export class AuthorizeResponse {
  valid = false;
  metadata = new AuthorizeMetadata();

  constructor(payload?: Partial<AuthorizeResponse>) {
    Object.assign(this, payload);
  }
}
