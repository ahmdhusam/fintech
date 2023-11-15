import { Decimal } from '@prisma/client/runtime/library';
import { Account } from '../../database/database.service';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AccountsSerialize implements Omit<Account, 'id' | 'userId'> {
  @ApiResponseProperty()
  @Expose()
  isActive: boolean;

  @ApiResponseProperty()
  @Expose()
  balance: Decimal;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;
}
