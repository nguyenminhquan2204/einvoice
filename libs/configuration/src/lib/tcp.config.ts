import { Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, ClientsProviderAsyncOptions, TcpClientOptions, Transport } from '@nestjs/microservices';
import { IsNotEmpty, IsObject } from 'class-validator';
import { createTracingClientProxy } from '@common/observability/tracing/tracing.util';

export enum TCP_SERVICES {
  INVOICE_SERVICE = 'TCP_INVOICE_SERVICE',
  PRODUCT_SERVICE = 'TCP_PRODUCT_SERVICE',
  USER_ACCESS_SERVICE = 'TCP_USER_ACCESS_SERVICE',
  AUTHORIZER_SERVICE = 'TCP_AUTHORIZER_SERVICE',
  PDF_GENERATOR_SERVICE = 'TCP_PDF_GENERATOR_SERVICE',
  MEDIA_SERVICE = 'TCP_MEDIA_SERVICE',
}

export class TcpConfiguration {
  @IsNotEmpty()
  @IsObject()
  TCP_INVOICE_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_PRODUCT_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_USER_ACCESS_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_AUTHORIZER_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_PDF_GENERATOR_SERVICE: TcpClientOptions;

  @IsNotEmpty()
  @IsObject()
  TCP_MEDIA_SERVICE: TcpClientOptions;

  constructor() {
    Object.entries(TCP_SERVICES).forEach(([key, serivceName]) => {
      const host = process.env[`${key}_HOST`] || 'localhost';
      const port = Number(process.env[`${serivceName}_PORT`]);

      this[serivceName] = TcpConfiguration.setValue(host, port);
    });
  }

  private static setValue(host: string, port: number): TcpClientOptions {
    return { transport: Transport.TCP, options: { host, port } };
  }
}

// export function TcpProvider(serviceName: keyof TcpConfiguration): ClientsProviderAsyncOptions {
//   return {
//     name: serviceName,
//     imports: [ConfigModule],
//     inject: [ConfigService],
//     useFactory: (configService: ConfigService) => {
//       return configService.get(`TCP_SERV.${serviceName}`) as TcpClientOptions;
//     },
//   };
// }

export const TcpProvider = (serviceName: keyof TcpConfiguration): Provider => {
  return {
    provide: serviceName,
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => {
      const option = configService.get(`TCP_SERV.${serviceName}`) as TcpClientOptions;
      const client = ClientProxyFactory.create(option);
      return createTracingClientProxy(client);
    },
  };
};
