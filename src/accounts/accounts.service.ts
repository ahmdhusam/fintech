import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AccountsRepository,
  GetUniqueAccountInput,
} from './accounts.repository';
import { Account, Decimal, User } from '../database/database.service';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepo: AccountsRepository) {}

  async create(user: User): Promise<Account> {
    return await this.accountsRepo.create(user.id);
  }

  async getAll(user: User): Promise<Account[]> {
    return await this.accountsRepo.getBy({ userId: user.id });
  }

  async getOneById(accountId: number): Promise<Account> {
    return await this.accountsRepo.getOneById(accountId);
  }

  async getOneBy(where: GetUniqueAccountInput): Promise<Account> {
    return await this.accountsRepo.getOneBy(where);
  }

  async deleteOne(user: User, accountId: number): Promise<Account> {
    const account = await this.accountsRepo.getOneById(accountId);
    this.validate(user, account);

    return await this.accountsRepo.deleteOneById(accountId);
  }

  validate(
    user: User,
    account: Account,
    customNotFoundErr?: string,
    customNotActiveErr?: string,
    isOwnerCheck: boolean = true,
  ): void {
    if (!account)
      throw new NotFoundException(customNotFoundErr ?? 'Account Not Found');

    if (!account.isActive)
      new ForbiddenException(customNotActiveErr ?? 'The account is not active');

    // @ts-ignore
    if (!user.hasAccount(account) && isOwnerCheck)
      throw new ForbiddenException('Not Allowed');
  }

  addToBalance(account: Account, amount: Decimal): Decimal {
    return account.balance.add(amount);
  }

  subtractFromBalance(account: Account, amount: Decimal): Decimal {
    return account.balance.sub(amount);
  }

  isLessThanBalance(account: Account, amount: Decimal): boolean {
    return account.balance.lt(amount);
  }
}
