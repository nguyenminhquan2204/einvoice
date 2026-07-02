import { Module } from '@nestjs/common';
import { TConfiguration, CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    ProductModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
