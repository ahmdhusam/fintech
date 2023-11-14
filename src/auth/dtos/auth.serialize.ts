import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AuthSerialize {
  @ApiResponseProperty()
  @Expose()
  access_token?: string;
}
