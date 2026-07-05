import { BadRequestException, Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserTcpRequest } from '@common/interfaces/tcp/user';
import { ERROR_CODE } from '@common/constants/enum/error-code.enum';
import { createUserRequestMapping } from '../mappers';
import { TCP_SERVICES } from '@common/configuration/tcp.config';
import { TcpClient } from '@common/interfaces/tcp/common/tcp-client.interface';
import { CreateKeycloakUserTcpRequest } from '@common/interfaces/tcp/authorizer';
import { TCP_REQUEST_MESSAGE } from '@common/constants/enum/tcp-request-message.enum';
import { firstValueFrom, map } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    @Inject(TCP_SERVICES.AUTHORIZER_SERVICE)
    private readonly authorizerClient: TcpClient,
  ) {}

  async create(processId: string, data: CreateUserTcpRequest) {
    const isExist = await this.userRepository.getByEmail(data.email);
    if (isExist) {
      throw new BadRequestException(ERROR_CODE.USER_ALREADY_EXISTS);
    }

    const userId = await this.createKeycloakUser(processId, {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const input = createUserRequestMapping(data, userId!);
    return this.userRepository.create(input);
  }

  createKeycloakUser(processId: string, data: CreateKeycloakUserTcpRequest) {
    return firstValueFrom(
      this.authorizerClient
        .send<string>(TCP_REQUEST_MESSAGE.KEYCLOAK.CREATE_USER, {
          processId,
          data,
        })
        .pipe(map((data) => data.data)),
    );
  }

  async getUserByUserId(userId: string) {
    const result = await this.userRepository.getByUserId(userId);
    if (!result) {
      throw new NotFoundException('User not found');
    }

    return result;
  }
}
