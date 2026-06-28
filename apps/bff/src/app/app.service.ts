import { Injectable } from '@nestjs/common';
import { NAME } from '@common/constants/common.constant';

@Injectable()
export class AppService {
  getData(): { message: string } {
    console.log('Name: ', NAME);
    return { message: 'Hello API' };
  }
}
