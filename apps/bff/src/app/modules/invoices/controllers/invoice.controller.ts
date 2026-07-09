import { Controller, Post, Body, Inject, Logger, Param } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseDto } from '@common/interfaces/gateway/response.interface';
import { InvoiceResponseDto, CreateInvoiceRequestDto } from '@common/interfaces/gateway/invoices';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { CreateInvoiceTcpRequest, InvoiceTcpResponse, SendInvoiceTcpRequest } from '@common/interfaces/tcp/invoices';
import { ProcessId } from '@common/decorators/processId.decorator';
import { map } from 'rxjs';
import { UserData } from '@common/decorators/userData.decorator';
import { AuthorizeMetadata } from '@common/interfaces/tcp/authorizer';
import { Authorization } from '@common/decorators/authorizer.decorator';
import { Permissions } from '@common/decorators/permission.decorator';
import { PERMISSION } from '@common/constants/enum/role.enum';

@ApiTags('Invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(@Inject(TCP_SERVICES.INVOICE_SERVICE) private readonly invoiceClient: TcpClient) {}

  @Post()
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_CREATE])
  create(
    @ProcessId() processId: string,
    @UserData() userData: AuthorizeMetadata,
    @Body() body: CreateInvoiceRequestDto,
  ) {
    return this.invoiceClient
      .send<InvoiceTcpResponse, CreateInvoiceTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.CREATE, {
        data: body,
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }

  @Post(':id/send')
  @ApiOkResponse({ type: ResponseDto<InvoiceResponseDto> })
  @ApiOperation({ summary: 'Create a new invoice' })
  @Authorization({ secured: true })
  @Permissions([PERMISSION.INVOICE_SEND])
  send(@Param('id') id: string, @ProcessId() processId: string, @UserData() userData: AuthorizeMetadata) {
    return this.invoiceClient
      .send<string, SendInvoiceTcpRequest>(TCP_REQUEST_MESSAGE.INVOICE.SEND, {
        data: { invoiceId: id, userId: userData.userId! },
        processId,
      })
      .pipe(map((data) => new ResponseDto(data)));
  }
}
