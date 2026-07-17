import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDestination } from '@common/schemas/user.schema';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { UserGrpcController } from './controllers/user-grpc.controller';

@Module({
  imports: [MongooseModule.forFeature([UserDestination]), ClientsModule.registerAsync([])],
  controllers: [UserController, UserGrpcController],
  exports: [],
  providers: [TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE), UserService, UserRepository],
})
export class UserModule {}
