import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { AuthorizeController } from './controllers/authorize.controller';

@Module({
  imports: [ClientsModule.registerAsync([])],
  controllers: [AuthorizeController],
  providers: [TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)],
})
export class AuthorizeModule {}
