import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { InvoiceController } from './controllers/invoice.controller';

@Module({
  imports: [ClientsModule.registerAsync([])],
  controllers: [InvoiceController],
  providers: [TcpProvider(TCP_SERVICES.INVOICE_SERVICE)],
})
export class InvoiceModule {}
