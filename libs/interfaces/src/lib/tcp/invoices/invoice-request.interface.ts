import { CreateInvoiceRequestDto } from '../../gateway/invoices/invoice-request.dto';

export type CreateInvoiceTcpRequest = CreateInvoiceRequestDto;

export type SendInvoiceTcpRequest = {
  invoiceId: string;
  userId: string;
};
