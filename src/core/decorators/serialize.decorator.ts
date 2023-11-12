import { UseInterceptors } from '@nestjs/common';
import { ClassConstructor } from '../interfaces/serialize.interface';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';

export const UseSerialize = (Dto: ClassConstructor) =>
  UseInterceptors(new SerializeInterceptor(Dto));
