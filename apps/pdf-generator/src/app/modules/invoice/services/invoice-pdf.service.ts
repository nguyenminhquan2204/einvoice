import { Injectable } from '@nestjs/common';
import { PdfService } from '../../pdf/services/pdf.service';
import { Invoice } from '@common/schemas/invoice.schema';
import path from 'path';

@Injectable()
export class InvoicePdfService {
  constructor(private readonly pdfService: PdfService) {}

  async generateInvoicePdf(invoice: Invoice): Promise<Uint8Array<ArrayBufferLike>> {
    const templatePath = path.join(__dirname, 'templates', 'invoice.template.ejs');
    const subtotal = invoice.items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);

    const data = {
      client: invoice.client,
      status: invoice.status,
      items: invoice.items,
      vatAmount: invoice.vatAmount,
      totalAmount: invoice.totalAmount,
      subtotal,
    };

    return this.pdfService.generatePdfFromEjs(templatePath, data);
  }
}
