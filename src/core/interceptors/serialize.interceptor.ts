import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { plainToClass } from 'class-transformer';
import { ClassConstructor } from '../interfaces/serialize.interface';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly Dto: ClassConstructor) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((value) =>
        plainToClass(this.Dto, value, {
          excludeExtraneousValues: true,
          enableImplicitConversion: true,
        }),
      ),
    );
  }
}
