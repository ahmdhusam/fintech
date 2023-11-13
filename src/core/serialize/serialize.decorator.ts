import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from '../serialize/serialize.interface';
import { SerializeInterceptor } from '../serialize/serialize.interceptor';

export const UseSerialize = (Dto: ClassConstructor) =>
  UseInterceptors(new SerializeInterceptor(Dto));
