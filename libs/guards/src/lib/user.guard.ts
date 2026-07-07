import { CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException, Inject } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { MetaDataKeys } from '@common/constants/common.constant';
import { getAccessToken } from '@common/utils/request.util';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { firstValueFrom } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { AuthorizeResponse } from '@common/interfaces/tcp/authorizer/authorizer-response.interface';
import { setUserData } from '@common/utils/request.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { createHash } from 'crypto';
import { GRPC_SERVICES } from '@common/configuration/grpc.config';
import { ClientGrpc } from '@nestjs/microservices';
import { AuthorizerService } from '@common/interfaces/grpc/authorizer';

@Injectable()
export class UserGuard implements CanActivate {
  private readonly logger = new Logger(UserGuard.name);
  private authorizerService: AuthorizerService;

  constructor(
    private readonly reflector: Reflector,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerClient: TcpClient,
    @Inject(GRPC_SERVICES.AUTHORIZER_SERVICE) private readonly grpcAuthorizerClient: ClientGrpc,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  onModuleInit() {
    this.authorizerService = this.grpcAuthorizerClient.getService<AuthorizerService>('AuthorizerService');
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authOptions = this.reflector.getAllAndOverride<{ secured: boolean }>(MetaDataKeys.SECURED, [
      context.getHandler(),
      context.getClass(),
    ]);
    // const authOptions = this.reflector.get<{ secured: boolean }>(MetaDataKeys.SECURED, context.getHandler());
    const request = context.switchToHttp().getRequest();

    if (!authOptions?.secured) {
      return true;
    }

    return this.verifyToken(request);
  }

  private async verifyToken(request: any): Promise<boolean> {
    try {
      const token = getAccessToken(request);
      const processId = request[MetaDataKeys.PROCESS_ID];

      const cacheKey = this.generateTokenCacheKey(token);
      try {
        const cacheData = await this.cacheManager.get<AuthorizeResponse>(cacheKey);
        if (cacheData) {
          setUserData(request, cacheData);
          return true;
        }
      } catch (error) {
        this.logger.warn(`Cache read failed, skip cache: ${error}`);
      }

      // Tcp
      // const result = await this.verifyUserToken(processId, token);

      // Grpc
      const response = await firstValueFrom(this.authorizerService.verifyUserToken({ processId, token }));
      const { data: result } = response;

      if (!result?.valid) {
        throw new UnauthorizedException('Token invalidk');
      }
      this.logger.debug(`Set user data for redis with cacheKey: ${cacheKey}`);

      setUserData(request, result);
      this.cacheManager
        .set(cacheKey, result, 30 * 60 * 1000)
        .catch((error) => this.logger.warn(`Cache write failed: ${error?.message}`));

      return true;
    } catch (error) {
      this.logger.error({ error });
      throw new UnauthorizedException('Token is invalid');
    }
  }

  private async verifyUserToken(processId: string, token: string) {
    return firstValueFrom(
      this.authorizerClient
        .send<AuthorizeResponse, string>(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_TOKEN_USER, {
          processId,
          data: token,
        })
        .pipe(map((data) => data.data)),
    );
  }

  private generateTokenCacheKey(token: string): string {
    const hash = createHash('sha256').update(token).digest('hex');
    return `user-token:${hash}`;
  }
}
