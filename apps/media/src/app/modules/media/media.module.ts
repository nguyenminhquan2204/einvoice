import { Module } from '@nestjs/common';
import { MediaController } from './controllers/media.controller';
import { MediaService } from './services/media.service';

@Module({
  imports: [],
  exports: [],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
