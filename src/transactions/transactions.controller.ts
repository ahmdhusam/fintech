import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { Transaction, User } from '../database/database.service';
import { TransactionsService } from './transactions.service';
import { CurrentUser } from '../users/users.decorator';
import { AccountsService } from '../accounts/accounts.service';
import { TransactionDto } from './dtos/transaction-data.dto';
import { TransferDto } from './dtos/transfer.dto';
import { UseSerialize } from 'src/core/serialize/serialize.decorator';
import { TransactionsSerialize } from './dtos/transactions.serialize';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseSerialize(TransactionsSerialize)
@Controller('transactions')
export class TransactionsController {
  private readonly logger = new Logger(TransactionsController.name);

  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly accountsService: AccountsService,
  ) {}

  @ApiCreatedResponse({
    description: 'Successfully created a "deposit" transaction',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.CREATED)
  @Post('deposit')
  async deposit(
    @CurrentUser() currentUser: User,
    @Body() data: TransactionDto,
  ): Promise<Transaction> {
    const account = await this.accountsService.getOneById(data.accountId);
    this.accountsService.validate(currentUser, account);

    const netAmount = this.transactionsService.calcTax(data.amount);
    const newBalance = this.accountsService.addToBalance(account, netAmount);

    const result = await this.transactionsService.createDeposit(
      account.id,
      newBalance,
      netAmount,
    );

    return result[0];
  }

  @ApiCreatedResponse({
    description: 'Successfully created a "withdraw" transaction',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.CREATED)
  @Post('withdraw')
  async withdraw(
    @CurrentUser() currentUser: User,
    @Body() data: TransactionDto,
  ): Promise<Transaction> {
    const account = await this.accountsService.getOneById(data.accountId);
    this.accountsService.validate(currentUser, account);

    const grossAmount = this.transactionsService.calcGross(data.amount);
    if (this.accountsService.isLessThanBalance(account, grossAmount))
      throw new ForbiddenException(
        `Your account does not have enough balance (${grossAmount}) for this transaction.`,
      );

    const newBalance = this.accountsService.subtractFromBalance(
      account,
      grossAmount,
    );

    const result = await this.transactionsService.createWithdraw(
      account.id,
      newBalance,
      data.amount,
    );

    return result[0];
  }

  @ApiCreatedResponse({
    description: 'Successfully created a "transfer" transaction',
  })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.CREATED)
  @Post('transfer')
  async transfer(
    @CurrentUser() currentUser: User,
    @Body() data: TransferDto,
  ): Promise<Transaction> {
    const [sender, receiver] = await Promise.all([
      this.accountsService.getOneById(data.accountId),
      this.accountsService.getOneBy({ key: data.accountKey }),
    ]);

    this.accountsService.validate(
      currentUser,
      sender,
      `Sender account with ID ${data.accountId} not found`,
      `Sender account with ID ${data.accountId} is not active`,
    );

    this.accountsService.validate(
      currentUser,
      receiver,
      `Receiver account with KEY ${data.accountKey} not found`,
      `Receiver account with KEY ${data.accountKey} is not active`,
      false,
    );

    const grossAmount = this.transactionsService.calcGross(data.amount);
    if (this.accountsService.isLessThanBalance(sender, grossAmount))
      throw new ForbiddenException(
        `Your account does not have enough balance (${grossAmount}) for this transaction.`,
      );

    const senderAccountBalance = this.accountsService.subtractFromBalance(
      sender,
      grossAmount,
    );
    const receiverAccountBalance = this.accountsService.addToBalance(
      receiver,
      data.amount,
    );

    const result = await this.transactionsService.createTransfer(
      {
        fromAccountId: sender.id,
        toAccountId: receiver.id,
        fromAccountBalance: senderAccountBalance,
        toAccountBalance: receiverAccountBalance,
      },
      data.amount,
    );

    return result[0];
  }
}
