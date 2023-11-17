import { Injectable } from '@nestjs/common';
import {
  Account,
  DatabaseService,
  Decimal,
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../database/database.service';

export interface TransferInput {
  fromAccountId: number;
  toAccountId: number;
  fromAccountBalance: Decimal;
  toAccountBalance: Decimal;
}

export type GetPendingInput = Partial<Pick<Transaction, 'id' | 'createdAt'>>;

@Injectable()
export class TransactionsService {
  private readonly isolationLevel = 'Serializable';
  private readonly TAX = 1.5;

  constructor(private readonly DBContext: DatabaseService) {}

  async createDeposit(
    accountId: number,
    balance: Decimal,
    amount: Decimal,
  ): Promise<[Transaction, Account]> {
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
      data: { balance },
    });

    return await this.DBContext.$transaction(
      [createTransaction, updateAccount],
      {
        isolationLevel: this.isolationLevel,
      },
    );
  }

  async createWithdraw(
    accountId: number,
    balance: Decimal,
    amount: Decimal,
  ): Promise<[Transaction, Account]> {
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
      data: { balance },
    });

    return await this.DBContext.$transaction(
      [createTransaction, updateAccount],
      {
        isolationLevel: this.isolationLevel,
      },
    );
  }

  async createTransfer(
    accountData: TransferInput,
    amount: Decimal,
  ): Promise<[Transaction, Account]> {
    const createTransaction = this.DBContext.transaction.create({
      data: {
        amount,
        type: TransactionType.Transfer,
        status: TransactionStatus.Pending,
        fromAccountId: accountData.fromAccountId,
        toAccountId: accountData.toAccountId,
      },
    });

    const updateFromAccount = this.DBContext.account.update({
      where: { id: accountData.fromAccountId },
      data: { balance: accountData.fromAccountBalance },
    });

    return await this.DBContext.$transaction(
      [createTransaction, updateFromAccount],
      {
        isolationLevel: this.isolationLevel,
      },
    );
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
  ): Promise<[Transaction, Account]> {
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
    );
  }

  calcTax(amount: Decimal): Decimal {
    return new Decimal(amount).sub(this.TAX);
  }

  calcGross(amount: Decimal): Decimal {
    return new Decimal(amount).add(this.TAX);
  }
}
