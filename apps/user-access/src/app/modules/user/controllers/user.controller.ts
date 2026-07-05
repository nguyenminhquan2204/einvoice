import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { UserService } from '../services/user.service';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { ProcessId } from '@common/decorators/processId.decorator';
import { User } from '@common/schemas/user.schema';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.CREATE)
  async create(@ProcessId() processId: string, @RequestParams() data: CreateUserTcpRequest): Promise<Response<string>> {
    await this.userService.create(processId, data);
    return Response.success<string>(HTTP_MESSAGE.CREATED);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.USER.GET_USER_BY_USER_ID)
  async getUserByUserId(@RequestParams() userId: string) {
    const user = await this.userService.getUserByUserId(userId);
    return Response.success<User>(user);
  }
}
