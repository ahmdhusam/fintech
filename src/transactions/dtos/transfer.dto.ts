import { ApiProperty } from '@nestjs/swagger';
import { TransactionDto } from './transaction-data.dto';
import { IsString, IsUUID } from 'class-validator';

export class TransferDto extends TransactionDto {
  @ApiProperty()
  @IsUUID()
  @IsString()
  accountKey: string;
}
