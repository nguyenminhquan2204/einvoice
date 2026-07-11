import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoices';
import { createCheckoutSessionMapping, invoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Invoice } from '@common/schemas/invoice.schema';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ObjectId } from 'mongodb';
import { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
import { PaymentService } from '../../payment/services/payment.service';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    private readonly paymentService: PaymentService,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
    @Inject(TCP_SERVICES.MEDIA_SERVICE) private readonly mediaClient: TcpClient,
    @Inject('INVOICE_SERVICE') private readonly mailClient: ClientKafka,
  ) {}

  create(params: CreateInvoiceTcpRequest) {
    const input = invoiceRequestMapping(params);
    return this.invoiceRepository.create(input);
  }

  async sendById(processId: string, params: SendInvoiceTcpRequest) {
    const { userId, invoiceId } = params;

    const invoice = await this.invoiceRepository.findById(invoiceId);
    if (!invoice || invoice.status !== INVOICE_STATUS.CREATED) {
      throw new BadRequestException(ERROR_CODE.INVOICE_CAN_NOT_BE_SEND);
    }

    const pdfBase64 = await this.generatorInvoicePdf(processId, invoice);
    const fileUrl = await this.uploadFile(processId, { fileBase64: pdfBase64!, fileName: `invoice-${invoiceId}` });

    const checkoutData = await this.paymentService.createCheckoutSession(createCheckoutSessionMapping(invoice));

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
      fileUrl,
    });

    // Kafka
    this.mailClient.emit('invoice-send', {
      invoiceId,
      clientEmail: invoice.client.email,
    });

    return checkoutData.url;
  }

  generatorInvoicePdf(processId: string, data: Invoice) {
    return firstValueFrom(
      this.pdfGeneratorClient
        .send<string, Invoice>(TCP_REQUEST_MESSAGE.PDF_GENERATOR.CREATE_INVOICE_PDF, {
          processId,
          data,
        })
        .pipe(map((data) => data.data)),
    );
  }

  uploadFile(processId: string, data: UploadFileTcpRequest) {
    return firstValueFrom(
      this.mediaClient
        .send<string, UploadFileTcpRequest>(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE, {
          processId,
          data,
        })
        .pipe(map((data) => data.data)),
    );
  }

  updateInvoicePaid(invoiceId: string) {
    return this.invoiceRepository.updateById(invoiceId, { status: INVOICE_STATUS.PAID });
  }
}
