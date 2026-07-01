import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { MetaDataKeys } from '@common/constants/common.constant';

export const ProcessId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request[MetaDataKeys.PROCESS_ID] || 'N/A';
});
