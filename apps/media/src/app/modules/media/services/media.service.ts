import { UploadFileTcpRequest } from '@common/interfaces/tcp/media';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  uploadFile(params: UploadFileTcpRequest) {
    return '';
  }
}
