import { AuthorizeResponse, LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken';
import JwksRsa, { JwksClient } from 'jwks-rsa';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom, map } from 'rxjs';
import { User } from '@common/schemas/user.schema';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Role } from '@common/schemas/role.schema';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { UserAccessService } from '@common/interfaces/grpc/user-access';

@Injectable()
export class AuthorizerService {
  private readonly logger = new Logger(AuthorizerService.name);
  private userAccessService: UserAccessService;
  private jwtsClient: JwksClient;

  constructor(
    private readonly keycloakHttpService: KeycloakHttpService,
    private readonly configService: ConfigService,
    @Inject(TCP_SERVICES.USER_ACCESS_SERVICE) private readonly userAccessClient: TcpClient,
    @Inject(GRPC_SERVICES.USER_ACCESS_SERVICE) private readonly grpcUserAccessClient: ClientGrpc,
  ) {
    const host = configService.get('KEYCLOAK_CONFIG.HOST');
    const realm = configService.get('KEYCLOAK_CONFIG.REALM');

    this.jwtsClient = JwksRsa({
      jwksUri: `${host}/realms/${realm}/protocol/openid-connect/certs`,
      cache: true,
      rateLimit: true,
    });
  }

  onModuleInit() {
    this.userAccessService = this.grpcUserAccessClient.getService<UserAccessService>('UserAccessService');
  }

  async login(data: LoginTcpRequest) {
    const { username, password } = data;

    const { access_token, refresh_token } = await this.keycloakHttpService.exchangeUserToken({ username, password });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }

  async verifyUserToken(processId: string, token: string): Promise<AuthorizeResponse> {
    const decoded = jwt.decode(token, { complete: true }) as Jwt;
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new UnauthorizedException('Token invalid structure');
    }

    try {
      const key = await this.jwtsClient.getSigningKey(decoded.header.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] }) as JwtPayload;
      // this.logger.debug(payload);

      const user = await this.userValidation(processId, payload.sub!);

      return {
        valid: true,
        metadata: {
          jwt: payload,
          permissions: (user?.roles as unknown as Role[]).map((role) => role.permissions).flat(),
          user: user,
          userId: user?.id,
        },
      };
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Token is invalid');
    }
  }

  private async userValidation(processId: string, userId: string) {
    // TCP
    // return await this.getUserByUserId(processId, userId);

    // GRPC
    return await firstValueFrom(
      this.userAccessService.getUserByUserId({ processId, userId }).pipe(map((data) => data.data)),
    );
  }

  private getUserByUserId(processId: string, userId: string) {
    return firstValueFrom(
      this.userAccessClient
        .send<User, string>(TCP_REQUEST_MESSAGE.USER.GET_USER_BY_USER_ID, {
          processId,
          data: userId,
        })
        .pipe(map((data) => data.data)),
    );
  }
}
