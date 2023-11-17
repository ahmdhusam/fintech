import { Injectable } from '@nestjs/common';
import {
  DatabaseService,
  Decimal,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../database/database.service';

export type GetPendingInput = Partial<Pick<Transaction, 'id' | 'createdAt'>>;

@Injectable()
export class TransactionsService {
  private readonly isolationLevel = 'Serializable';

  // TODO: Move it to the env variable file to be dynamic
  static readonly TAX = 1.5;

  constructor(private readonly DBContext: DatabaseService) {}

  async createDeposit(
    accountId: number,
    amount: Decimal,
  ): Promise<Transaction> {
    const createTransaction = this.DBContext.transaction.create({
      data: {
        amount,
        type: TransactionType.Deposit,
        status: TransactionStatus.Transferred,
        toAccountId: accountId,
      },
    });

    const updateAccount = this.DBContext.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });

    return await this.DBContext.$transaction(
      [createTransaction, updateAccount],
      {
        isolationLevel: this.isolationLevel,
      },
    )[0];
  }

  async createWithdraw(
    accountId: number,
    amount: Decimal,
    grossAmount: Decimal,
  ): Promise<Transaction> {
    const createTransaction = this.DBContext.transaction.create({
      data: {
        amount,
        type: TransactionType.Withdraw,
        status: TransactionStatus.Transferred,
        fromAccountId: accountId,
      },
    });

    const updateAccount = this.DBContext.account.update({
      where: { id: accountId },
      data: { balance: { decrement: grossAmount } },
    });

    return await this.DBContext.$transaction(
      [createTransaction, updateAccount],
      {
        isolationLevel: this.isolationLevel,
      },
    )[0];
  }

  async createTransfer(
    senderId: number,
    receiverId: number,
    amount: Decimal,
    grossAmount: Decimal,
  ): Promise<Transaction> {
    const createTransaction = this.DBContext.transaction.create({
      data: {
        amount,
        type: TransactionType.Transfer,
        status: TransactionStatus.Pending,
        fromAccountId: senderId,
        toAccountId: receiverId,
      },
    });

    const updateFromAccount = this.DBContext.account.update({
      where: { id: senderId },
      data: { balance: { decrement: grossAmount } },
    });

    return await this.DBContext.$transaction(
      [createTransaction, updateFromAccount],
      {
        isolationLevel: this.isolationLevel,
      },
    )[0];
  }

  async getAll(userId: number): Promise<Transaction[]> {
    // @ts-ignore
    return await this.DBContext.transaction.findMany({
      where: {
        OR: [{ fromAccountId: userId }, { toAccountId: userId }],
      },
      select: {
        id: true,
        amount: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        toAccount: {
          select: {
            key: true,
          },
        },
      },
    });
  }

  async getPending(where: GetPendingInput): Promise<Transaction[]> {
    return await this.DBContext.transaction.findMany({
      where: {
        status: TransactionStatus.Pending,
        ...where,
      },
    });
  }

  async transfer(
    transactionId: number,
    accountId: number,
    amount: Decimal,
  ): Promise<Transaction> {
    const updateTransaction = this.DBContext.transaction.update({
      where: {
        id: transactionId,
      },
      data: {
        status: TransactionStatus.Transferred,
      },
    });

    const updateToAccount = this.DBContext.account.update({
      where: {
        id: accountId,
      },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    return await this.DBContext.$transaction(
      [updateTransaction, updateToAccount],
      { isolationLevel: this.isolationLevel },
    )[0];
  }

  calcTax(amount: Decimal): Decimal {
    return new Decimal(amount).sub(TransactionsService.TAX);
  }

  calcGross(amount: Decimal): Decimal {
    return new Decimal(amount).add(TransactionsService.TAX);
  }
}
