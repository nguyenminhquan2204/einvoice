import axios from 'axios';
import { getAccessToken } from '../support/auth.helper';
import { CreateInvoiceRequestDto, InvoiceResponseDto } from '@common/interfaces/gateway/invoices';

describe('Invoice E2E (HTTP)', () => {
  let accessToken: string;

  beforeAll(async () => {
    const authData = await getAccessToken();
    accessToken = authData.accessToken;
  });

  it('should create an invoice and send it', async () => {
    const createPayload: CreateInvoiceRequestDto = {
      client: {
        name: 'Nguyễn Minh Quân',
        email: 'nguyenminhquantth@gmail.com',
        address: 'Thôn Đông Quý, xã Đông Tiền Hải, Tỉnh Thái Bình',
      },
      items: [
        {
          productId: 'TB006',
          name: 'Laptop ASUS Vivobook 15',
          quantity: 1,
          unitPrice: 15990000,
          vatRate: 10,
          total: 17589000,
        },
      ],
    };

    const createRes = await axios.post<{ data: InvoiceResponseDto }>('/invoice', createPayload, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    expect(createRes.status).toBe(201);
    const invoice = createRes.data.data;
    expect(invoice).toBeDefined();

    const sendRes = await axios.post(
      `/invoice/${invoice.id}/send`,
      {},
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    expect(sendRes.status).toBe(201);
  }, 10000);
});
