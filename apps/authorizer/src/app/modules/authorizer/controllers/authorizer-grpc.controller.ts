import { Controller, UseInterceptors } from '@nestjs/common';
import { AuthorizerService } from '../services/authorizer.service';
import { GrpcMethod } from '@nestjs/microservices';
import { VerifyUserTokenRequest, VerifyUserTokenResponse } from '@common/interfaces/grpc/authorizer';
import { Response } from '@common/interfaces/grpc/common/response.interface';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerGrpcController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @GrpcMethod('AuthorizerService', 'verifyUserToken')
  async verifyUserToken(params: VerifyUserTokenRequest): Promise<VerifyUserTokenResponse> {
    const result = await this.authorizerService.verifyUserToken(params.processId, params.token);
    return Response.success(result);
  }
}
