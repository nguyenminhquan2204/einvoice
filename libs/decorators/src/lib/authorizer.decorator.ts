import { MetaDataKeys } from '@common/constants/common.constant';
import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const Authorization = ({ secured = false }: { secured: boolean }) => {
  const setMetadata = SetMetadata(MetaDataKeys.SECURED, { secured });

  if (secured) {
    const decorator = [ApiBearerAuth()];
    return applyDecorators(...decorator, setMetadata);
  }

  return setMetadata;
};
