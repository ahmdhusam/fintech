import {
  TransactionStatus,
  TransactionType,
} from '../../database/database.service';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AccountsSerialize } from '../../accounts/dtos/accounts.serialize';

export class TransactionsSerialize {
  @ApiResponseProperty()
  @Expose()
  id: number;

  @ApiResponseProperty()
  @Expose()
  amount: number;

  @ApiResponseProperty({ enum: TransactionType })
  @Expose()
  type: TransactionType;

  @ApiResponseProperty({ enum: TransactionStatus })
  @Expose()
  status: TransactionStatus;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;

  @ApiResponseProperty()
  @Expose()
  toAccount: AccountsSerialize;
}
