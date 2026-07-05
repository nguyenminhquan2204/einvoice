import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { Controller, UseInterceptors } from '@nestjs/common';
import { AuthorizerService } from '../services/authorizer.service';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { AuthorizeResponse, LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { ProcessId } from '@common/decorators/processId.decorator';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class AuthorizerController {
  constructor(private readonly authorizerService: AuthorizerService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN)
  async login(@RequestParams() data: LoginTcpRequest) {
    const result = await this.authorizerService.login(data);
    return Response.success<LoginTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.AUTHORIZER.VERIFY_TOKEN_USER)
  async verifyUserToken(@ProcessId() processId: string, @RequestParams() token: string) {
    const result = await this.authorizerService.verifyUserToken(processId, token);
    return Response.success<AuthorizeResponse>(result);
  }
}
