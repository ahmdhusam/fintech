import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccountsSerialize {
  @ApiResponseProperty()
  @Expose()
  id: string;

  @ApiResponseProperty()
  @Expose()
  isActive: boolean;

  @ApiResponseProperty()
  @Expose()
  balance: number;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;
}
