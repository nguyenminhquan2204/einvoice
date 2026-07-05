import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import JwksRsa, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private jwtsClient: JwksClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
  ) {
    const host = configService.get('KEYCLOAK_CONFIG.HOST');
    const realm = configService.get('KEYCLOAK_CONFIG.REALM');

    this.jwtsClient = JwksRsa({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  async login(data: LoginTcpRequest) {
    const { username, password } = data;

    const { access_token, refresh_token } = await this.keycloakHttpService.exchangeUserToken({ username, password });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async verifyUserToken(token: string): Promise<AuthorizeResponse> {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Token invalid structure');
    }

    try {
      const key = await this.jwtsClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      this.logger.debug(payload);
      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: [],
          user: null,
          userId: null,
        },
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
