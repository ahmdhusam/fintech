import { IsInt, IsNumber, IsPositive, Min } from 'class-validator';
import { Decimal, Transaction } from '../../database/database.service';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto implements Pick<Transaction, 'amount'> {
  @ApiProperty({ type: Number })
  @Min(3)
  @IsPositive()
  @IsNumber()
  amount: Decimal;

  @ApiProperty()
  @IsPositive()
  @IsInt()
  @IsNumber()
  accountId: number;
}
