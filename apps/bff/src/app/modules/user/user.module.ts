import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { UserController } from './controllers/user.controller';
@Module({
  imports: [ClientsModule.registerAsync([])],
  controllers: [UserController],
  providers: [TcpProvider(TCP_SERVICES.USER_ACCESS_SERVICE)],
})
export class UserModule {}
