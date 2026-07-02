import { CreateInvoiceTcpRequest } from '@common/interfaces/tcp/invoices';
import { Invoice } from '@common/schemas/invoice.schema';

export const invoiceRequestMapping = (data: CreateInvoiceTcpRequest): Partial<Invoice> => {
  return {
    ...data,
    totalAmount: data.items.reduce((total, item) => total + item.total, 0),
    vatAmount: data.items.reduce(
      (totalVal, item) => totalVal + item.quantity * item.unitPrice * (item.vatRate / 100),
      0,
    ),
  };
};
