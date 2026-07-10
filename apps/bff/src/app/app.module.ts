import { Module } from '@nestjs/common';
import { CONFIGURATION, TConfiguration } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from '@common/middlewares/logger.middleware';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ExceptionInterceptor } from '@common/interceptors/exception.interceptor';
import { InvoiceModule } from './modules/invoices/invoice.module';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { AuthorizeModule } from './modules/authorize/authorize.module';
import { UserGuard } from '@common/guards/user.guard';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { PermissionGuard } from '@common/guards/permission.guard';
import { RedisProvider } from '@common/configuration/redis.config';
import { ThrottlerProvider } from '@common/configuration/throttler.config';
import { ThrottlerGuard } from '@nestjs/throttler';
import { GrpcProvider, GRPC_SERVICES } from '@common/configuration/grpc.config';
import { WebhookModule } from './modules/webhook/webhook.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    ClientsModule.registerAsync([TcpProvider(TCP_SERVICES.AUTHORIZER_SERVICE)]),
    ClientsModule.registerAsync([GrpcProvider(GRPC_SERVICES.AUTHORIZER_SERVICE)]),
    RedisProvider,
    ThrottlerProvider,
    InvoiceModule,
    ProductModule,
    UserModule,
    AuthorizeModule,
    WebhookModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
