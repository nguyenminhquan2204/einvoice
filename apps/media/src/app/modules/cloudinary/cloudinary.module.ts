import { Module } from '@nestjs/common';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  imports: [],
  exports: [CloudinaryService],
  controllers: [],
  providers: [CloudinaryService],
})
export class CloudinaryModule {}
