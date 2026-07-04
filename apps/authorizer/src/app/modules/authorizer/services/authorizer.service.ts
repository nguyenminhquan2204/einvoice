import { LoginTcpRequest } from '@common/interfaces/tcp/authorizer';
import { Injectable } from '@nestjs/common';
import { KeycloakHttpService } from '../../keycloak/services/keycloak-http.service';

@Injectable()
export class AuthorizerService {
  constructor(private readonly keycloakHttpService: KeycloakHttpService) {}

  async login(data: LoginTcpRequest) {
    const { username, password } = data;

    const { access_token, refresh_token } = await this.keycloakHttpService.exchangeUserToken({ username, password });

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    };
  }
}
