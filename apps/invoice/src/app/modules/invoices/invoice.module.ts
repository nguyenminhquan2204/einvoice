import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { MongoProvider } from '@common/configuration/mongo.config';
import { InvoiceDestination } from '@common/schemas/invoice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceRepository } from './repositories/invoice.repository';
import { TCP_SERVICES, TcpProvider } from '@common/configuration/tcp.config';
import { PaymentModule } from '../payment/payment.module';
import { ClientsModule } from '@nestjs/microservices';
import { KafkaModule } from '@common/kafka/kafka.module';
import { QUEUE_SERVICES } from '@common/constants/enum/queue.enum';
import { InvoiceSendSagaSteps } from './sagas/invoice-send-saga-steps.service';
import { SagaOrchestrationModule } from '@common/saga-orchestration/saga-orchestration.module';

@Module({
  imports: [
    MongooseModule.forFeature([InvoiceDestination]),
    ClientsModule.registerAsync([
      TcpProvider(TCP_SERVICES.PDF_GENERATOR_SERVICE),
      TcpProvider(TCP_SERVICES.MEDIA_SERVICE),
    ]),
    KafkaModule.register(QUEUE_SERVICES.INVOICE),
    SagaOrchestrationModule.forRoot(),
    MongoProvider,
    PaymentModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository, InvoiceSendSagaSteps],
})
export class InvoiceModule {}
