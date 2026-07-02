import { Module } from '@nestjs/common';
import { InvoiceService } from './services/invoice.service';
import { InvoiceController } from './controllers/invoice.controller';
import { MongoProvider } from '@common/configuration/mongo.config';
import { InvoiceDestination } from '@common/schemas/invoice.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceRepository } from './repositories/invoice.repository';

@Module({
  imports: [MongoProvider, MongooseModule.forFeature([InvoiceDestination])],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceRepository],
})
export class InvoiceModule {}
