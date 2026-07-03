import { Module } from '@nestjs/common';
import { TConfiguration, CONFIGURATION } from '../configuration';
import { ConfigModule } from '@nestjs/config';
import { RoleModule } from './role/role.module';
import { MongoProvider } from '@common/configuration/mongo.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => CONFIGURATION],
    }),
    MongoProvider,
    RoleModule,
  ],
})
export class AppModule {
  static CONFIGURATION: TConfiguration = CONFIGURATION;
}
