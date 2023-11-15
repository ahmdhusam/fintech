import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccountsRepository } from './accounts.repository';
import { Account, User } from '../database/database.service';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepo: AccountsRepository) {}

  async create(user: User): Promise<Account> {
    return await this.accountsRepo.create(user.id);
  }

  async getAll(user: User): Promise<Account[]> {
    return await this.accountsRepo.getBy({ userId: user.id });
  }

  async deleteOne(user: User, accountId: number): Promise<Account> {
    const account = await this.accountsRepo.getOneById(accountId);
    if (!account) throw new NotFoundException('Account Not Found');

    if (account.userId !== user.id) throw new ForbiddenException('Not Allowed');

    return await this.accountsRepo.deleteOneById(accountId);
  }
}
