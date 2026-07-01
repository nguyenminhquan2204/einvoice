import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TcpLoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    const handler = context.getHandler();
    const handleName = handler.name;
    const args = context.getArgs();
    const param = args[0];
    const processId = param?.processId || 'N/A';

    Logger.log(
      `TCP >> Start process '${processId}' >> method: '${handleName}' >> at: '${now}' >> params: ${JSON.stringify(param)}`,
    );

    return next.handle().pipe(
      tap(() => {
        Logger.log(`TCP >> End process '${processId}' >> method: '${handleName}' >> after: '${Date.now() - now} ms'`);
      }),
    );
  }
}
