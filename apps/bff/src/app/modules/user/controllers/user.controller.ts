import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Controller, Inject, Post, Body } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProcessId } from '@common/decorators/processId.decorator';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { map } from 'rxjs';
import { CreateUserRequestDto } from '@common/interfaces/gateway/user';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { Authorization } from '@common/decorators/authorizer.decorator';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(@Inject(TCP_SERVICES.USER_ACCSESS_SERVICE) private readonly userAccessClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<string> })
  @ApiOperation({ summary: 'Create a new user' })
  @Authorization({ secured: true })
  create(@ProcessId() processId: string, @Body() body: CreateUserRequestDto) {
    return this.userAccessClient
      .send<string, CreateUserTcpRequest>(TCP_REQUEST_MESSAGE.USER.CREATE, {
        processId,
        data: body,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
