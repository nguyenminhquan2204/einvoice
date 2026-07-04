import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto, LoginRequestDto } from '@common/interfaces/gateway/authorize';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { ProcessId } from '@common/decorators/processId.decorator';
import { LoginTcpRequest, LoginTcpResponse } from '@common/interfaces/tcp/authorizer';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';

@ApiTags('Authentication')
@Controller('auth')
export class AuthorizeController {
  constructor(@Inject(TCP_SERVICES.AUTHORIZER_SERVICE) private readonly authorizerclient: TcpClient) {}

  @Post('login')
  @ApiOkResponse({ type: ResponseDto<LoginResponseDto> })
  @ApiOperation({ summary: 'Login with username and password' })
  login(@ProcessId() processId: string, @Body() body: LoginRequestDto) {
    return this.authorizerclient
      .send<LoginTcpResponse, LoginTcpRequest>(TCP_REQUEST_MESSAGE.AUTHORIZER.LOGIN, {
        processId,
        data: body,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
