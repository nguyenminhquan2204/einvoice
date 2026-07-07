import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Response } from '@common/interfaces/grpc/common/response.interface';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { UserService } from '../services/user.service';
import { UserById } from '@common/interfaces/grpc/user-access';
import { User } from '@common/schemas/user.schema';

@Controller()
@UseInterceptors(TcpLoggingInterceptor)
export class UserGrpcController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod('UserAccessService', 'getUserByUserId')
  async getUserByUserId(payload: UserById): Promise<Response<User>> {
    const result = await this.userService.getUserByUserId(payload.userId);
    return Response.success(result);
  }
}
