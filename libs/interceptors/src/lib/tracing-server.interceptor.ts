import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { context, propagation, Context } from '@opentelemetry/api';

@Injectable()
export class TcpServerTracingInterceptor implements NestInterceptor {
  intercept(ec: ExecutionContext, next: CallHandler<any>): Observable<any> {
    if (ec.getType() !== 'rpc') {
      return next.handle();
    }

    const data = ec.switchToRpc().getData();
    if (data && data.__tracing__) {
      const extractedContext: Context = propagation.extract(context.active(), data.__tracing__);

      // Run handler in context when extract start
      return context.with(extractedContext, () => {
        return next.handle();
      });
    }

    return next.handle();
  }
}
