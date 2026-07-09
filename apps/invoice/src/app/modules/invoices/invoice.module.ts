import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { MongoProvider } from '@common/configuration/mongo.config';
import { InvoiceDestination } from '@common/schemas/invoice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceRepository } from './repositories/invoice.repository';
import { ClientsModule } from '@nestjs/microservices';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    MongooseModule.forFeature([InvoiceDestination]),
    ClientsModule.registerAsync([
      TcpProvider(TCP_SERVICES.PDF_GENERATOR_SERVICE),
      TcpProvider(TCP_SERVICES.MEDIA_SERVICE),
    ]),
    MongoProvider,
    PaymentModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
