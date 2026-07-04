import { Module } from '@nestjs/common';
import { KeycloakController } from './controllers/keycloak.controller';
import { KeycloakHttpService } from './services/keycloak-http.service';

@Module({
  imports: [],
  controllers: [KeycloakController],
  exports: [],
  providers: [KeycloakHttpService],
})
export class KeycloakModule {}
