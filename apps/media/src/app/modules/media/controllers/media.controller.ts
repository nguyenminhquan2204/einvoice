import { Controller, UseInterceptors } from '@nestjs/common';
import { TcpLoggingInterceptor } from '@common/interceptors/tcpLogging.interceptor';
import { MessagePattern } from '@nestjs/microservices';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { RequestParams } from '@common/decorators/request-param.decorator';
import { UploadFileTcpRequest, UploadFileTcpResponse } from '@common/interfaces/tcp/media';
import { Response } from '@common/interfaces/tcp/common/response.interface';
import { MediaService } from '../services/media.service';
import { HTTP_MESSAGE } from '@common/constants/enum/http-message.enum';
import { TcpServerTracingInterceptor } from '@common/interceptors/tracing-server.interceptor';

@Controller()
@UseInterceptors(TcpLoggingInterceptor, TcpServerTracingInterceptor)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern(TCP_REQUEST_MESSAGE.MEDIA.UPLOAD_FILE)
  async uploadFile(@RequestParams() params: UploadFileTcpRequest): Promise<Response<UploadFileTcpResponse>> {
    const result = await this.mediaService.uploadFile(params);
    return Response.success<UploadFileTcpResponse>(result);
  }

  @MessagePattern(TCP_REQUEST_MESSAGE.MEDIA.DESTROY_FILE)
  async destroyFile(@RequestParams() publicId: string): Promise<Response<string>> {
    await this.mediaService.destroyFile(publicId);
    return Response.success<string>(HTTP_MESSAGE.DELETED);
  }
}
