import { Module } from '@nestjs/common';
import { AuthorizerController } from './controllers/authorizer.controller';
import { AuthorizerService } from './services/authorizer.service';
import { KeycloakModule } from '../keycloak/keycloak.module';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { AuthorizerGrpcController } from './controllers/authorizer-grpc.controller';
import { GRPC_SERVICES, GrpcProvider } from '@common/configuration/grpc.config';

@Module({
  imports: [ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.USER_ACCESS_SERVICE)]), KeycloakModule],
  controllers: [AuthorizerController, AuthorizerGrpcController],
  exports: [],
  providers: [AuthorizerService, TcpProvider(TCP_SERVICES.USER_ACCESS_SERVICE)],
})
export class AuthorizerModule {}
