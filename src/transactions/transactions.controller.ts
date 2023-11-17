import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  Get,
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
import { UseSerialize } from '../core/serialize/serialize.decorator';
import { TransactionsSerialize } from './dtos/transactions.serialize';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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

  // TODO: Should act like a webhook with payment gateway
  @ApiCreatedResponse({
    description: 'Successfully created a "deposit" transaction',
  })
  @ApiNotFoundResponse({ description: 'Account Not Found' })
  @ApiForbiddenResponse({ description: 'The account is not active' })
  @ApiForbiddenResponse({
    description: 'You do not have access to this account.',
  })
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

    const result = await this.transactionsService.createDeposit(
      account.id,
      netAmount,
    );

    return result;
  }

  // TODO: Should act like a webhook with payment gateway
  @ApiCreatedResponse({
    description: 'Successfully created a "withdraw" transaction',
  })
  @ApiNotFoundResponse({ description: 'Account Not Found' })
  @ApiForbiddenResponse({ description: 'The account is not active' })
  @ApiForbiddenResponse({
    description: 'You do not have access to this account.',
  })
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

    if (this.accountsService.isBalanceLessThan(account, grossAmount))
      throw new ForbiddenException(
        `Your account does not have enough balance (${grossAmount}) for this transaction.`,
      );

    const result = await this.transactionsService.createWithdraw(
      account.id,
      data.amount,
      grossAmount,
    );

    return result;
  }

  @ApiCreatedResponse({
    description: 'Successfully created a "transfer" transaction',
  })
  @ApiNotFoundResponse({ description: 'Account Not Found' })
  @ApiForbiddenResponse({ description: 'The account is not active' })
  @ApiForbiddenResponse({
    description: 'You do not have access to this account.',
  })
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

    if (sender.id === receiver.id)
      throw new ConflictException(
        'Transferring to the same account is not possible',
      );

    const grossAmount = this.transactionsService.calcGross(data.amount);

    if (this.accountsService.isBalanceLessThan(sender, grossAmount))
      throw new ForbiddenException(
        `Your account does not have enough balance (${grossAmount}) for this transaction.`,
      );

    const result = await this.transactionsService.createTransfer(
      sender.id,
      receiver.id,
      data.amount,
      grossAmount,
    );

    return result;
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @Get()
  async getAll(@CurrentUser() currentUser: User): Promise<Transaction[]> {
    return await this.transactionsService.getAll(currentUser.id);
  }
}
