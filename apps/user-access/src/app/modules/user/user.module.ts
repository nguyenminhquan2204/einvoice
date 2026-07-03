import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDestination } from '@common/schemas/user.schema';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';

@Module({
  imports: [MongooseModule.forFeature([UserDestination])],
  controllers: [UserController],
  exports: [],
  providers: [UserService, UserRepository],
})
export class UserModule {}
