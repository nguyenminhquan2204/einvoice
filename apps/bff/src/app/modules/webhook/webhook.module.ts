import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TcpProvider, TCP_SERVICES } from '@common/configuration/tcp.config';
import { WebhookController } from './controllers/webhook.controller';
import { StripeWebhookService } from './services/stripe-webhook.service';

@Module({
  imports: [ClientsModule.registerAsync([])],
  controllers: [WebhookController],
  providers: [TcpProvider(TCP_SERVICES.INVOICE_SERVICE), StripeWebhookService],
})
export class WebhookModule {}
