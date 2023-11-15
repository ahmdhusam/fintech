import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Account } from '../database/database.service';

export type GetAccountInput = Partial<Pick<Account, 'id' | 'userId'>>;
export type ModifyAccountInput = Pick<Account, 'balance' | 'isActive'>;

@Injectable()
export class AccountsRepository {
  constructor(private readonly DBContext: DatabaseService) {}

  async create(userId: number): Promise<Account> {
    return await this.DBContext.account.create({
      data: { balance: 0, userId },
    });
  }

  async getOneById(accountId: number): Promise<Account> {
    return await this.DBContext.account.findUnique({
      where: { id: accountId },
    });
  }

  async getBy(where: GetAccountInput): Promise<Account[]> {
    return await this.DBContext.account.findMany({ where });
  }

  async deleteOneById(accountId: number): Promise<Account> {
    return await this.DBContext.account.delete({ where: { id: accountId } });
  }

  async modify(accountId: number, data: ModifyAccountInput): Promise<Account> {
    return await this.DBContext.account.update({
      where: { id: accountId },
      data,
    });
  }
}
