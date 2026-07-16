import { Module } from '@nestjs/common';
import { TConfiguration, CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from './modules/invoices/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';
import { LoggerModule } from '@common/observability/logger/logger.module';
import { MetricsModule } from '@common/observability/metrics';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    LoggerModule.forRoot('invoice'),
    MetricsModule,
    InvoiceModule,
    PaymentModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
