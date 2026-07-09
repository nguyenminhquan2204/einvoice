import { Module } from '@nestjs/common';
import { TConfiguration, CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { InvoiceModule } from './modules/invoices/invoice.module';
import { PaymentModule } from './modules/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    InvoiceModule,
    PaymentModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
