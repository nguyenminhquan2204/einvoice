import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { InvoiceSentPayload } from '@common/interfaces/queue/invoice';
import { MailInvoiceService } from '../services/mail-invoice.service';

@Controller()
export class MailController {
  private readonly logger = new Logger(MailController.name);

  constructor(private readonly mailInvoice: MailInvoiceService) {}

  @EventPattern('invoice-send')
  async invoiceSendEvent(@Payload() payload: InvoiceSentPayload) {
    try {
      await this.mailInvoice.sentInvoice(payload);
    } catch (error) {
      this.logger.error(
        `Failed to process invoice-send event for invoice ${payload?.id}: ${
          error instanceof Error ? error.message : error
        }`,
      );
    }
  }
}
