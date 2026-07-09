import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InvoiceRepository } from '../repositories/invoice.repository';
import { CreateInvoiceTcpRequest, SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoices';
import { invoiceRequestMapping } from '../mappers';
import { INVOICE_STATUS } from '@common/constants/enum/invoice.enum';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { Invoice } from '@common/schemas/invoice.schema';
import { firstValueFrom, map } from 'rxjs';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { ObjectId } from 'mongodb';

@Injectable()
export class InvoiceService {
  constructor(
    private readonly invoiceRepository: InvoiceRepository,
    @Inject(TCP_SERVICES.PDF_GENERATOR_SERVICE) private readonly pdfGeneratorClient: TcpClient,
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
    // TODO: uploading file to cloudinary

    await this.invoiceRepository.updateById(invoiceId, {
      status: INVOICE_STATUS.SENT,
      supervisorId: new ObjectId(userId),
    });

    return pdfBase64;
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
}
