import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { ProductController } from './controllers/product.controller';

@Module({
  imports: [ClientsModule.registerAsync([])],
  controllers: [ProductController],
  providers: [TcpProvider(TCP_SERVICES.PRODUCT_SERVICE)],
})
export class ProductModule {}
