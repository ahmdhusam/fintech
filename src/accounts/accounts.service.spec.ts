import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';
import {
  Account,
  DatabaseService,
  Decimal,
  User,
} from '../database/database.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountsRepo: AccountsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        AccountsRepository,
        {
          provide: DatabaseService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    accountsRepo = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should call AccountsRepository.create()', async () => {
      const data: any = { id: 1, userId: 1, balance: new Decimal(0) };
      jest
        .spyOn(accountsRepo, 'create')
        .mockImplementation((data) => data as any);

      await service.create(data as any);

      expect(accountsRepo.create).toHaveBeenCalled();
      expect(accountsRepo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll()', () => {
    it('should call AccountsRepository.getBy()', async () => {
      jest
        .spyOn(accountsRepo, 'getBy')
        .mockImplementation((data) => data as any);

      await service.getAll({ id: 1 } as User);

      expect(accountsRepo.getBy).toHaveBeenCalled();
      expect(accountsRepo.getBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOneById()', () => {
    it('should call AccountsRepository.getOneById()', async () => {
      jest
        .spyOn(accountsRepo, 'getOneById')
        .mockImplementation((data) => data as any);

      await service.getOneById(1);

      expect(accountsRepo.getOneById).toHaveBeenCalled();
      expect(accountsRepo.getOneById).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOneBy()', () => {
    it('should call AccountsRepository.getOneBy()', async () => {
      jest
        .spyOn(accountsRepo, 'getOneBy')
        .mockImplementation((data) => data as any);

      await service.getOneBy({ id: 1 });

      expect(accountsRepo.getOneBy).toHaveBeenCalled();
      expect(accountsRepo.getOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteOne()', () => {
    it('should call AccountsRepository.getOneById()', async () => {
      jest
        .spyOn(accountsRepo, 'getOneById')
        .mockImplementation((data) => data as any);
      jest
        .spyOn(accountsRepo, 'deleteOneById')
        .mockResolvedValue({} as Account);
      jest.spyOn(service, 'validate').mockReturnValue();

      await service.deleteOne({ id: 1 } as User, 1);

      expect(accountsRepo.getOneById).toHaveBeenCalled();
      expect(accountsRepo.getOneById).toHaveBeenCalledTimes(1);
    });

    it('should call AccountsService.validate()', async () => {
      jest
        .spyOn(accountsRepo, 'getOneById')
        .mockImplementation((data) => ({ id: data }) as any);
      jest
        .spyOn(accountsRepo, 'deleteOneById')
        .mockResolvedValue({} as Account);
      jest.spyOn(service, 'validate').mockReturnValue();

      await service.deleteOne({ id: 1 } as User, 1);

      expect(service.validate).toHaveBeenCalled();
      expect(service.validate).toHaveBeenCalledTimes(1);
    });

    it('should call AccountsRepository.deleteOneById()', async () => {
      jest
        .spyOn(accountsRepo, 'getOneById')
        .mockImplementation((data) => ({ id: data }) as any);
      jest
        .spyOn(accountsRepo, 'deleteOneById')
        .mockResolvedValue({} as Account);
      jest.spyOn(service, 'validate').mockReturnValue();

      await service.deleteOne({ id: 1 } as User, 1);

      expect(accountsRepo.deleteOneById).toHaveBeenCalled();
      expect(accountsRepo.deleteOneById).toHaveBeenCalledTimes(1);
    });
  });

  describe('validate()', () => {
    const user = { id: 1, hasAccount: (_) => true } as User & {
      hasAccount: (a: Account) => boolean;
    };
    let account: Account;

    beforeEach(async () => {
      account = { id: 1, userId: 1, isActive: true } as Account;
    });

    it('should throw NotFoundException with message Account Not Found', async () => {
      account = undefined;

      expect(service.validate.bind(service, user, account)).toThrow(
        NotFoundException,
      );
      expect(service.validate.bind(service, user, account)).toThrow(
        'Account Not Found',
      );
    });

    it('should throw NotFoundException with custom not found error message', async () => {
      account = undefined;

      expect(
        service.validate.bind(
          service,
          user,
          account,
          'custom not found error message',
        ),
      ).toThrow(NotFoundException);
      expect(
        service.validate.bind(
          service,
          user,
          account,
          'custom not found error message',
        ),
      ).toThrow('custom not found error message');
    });

    it('should throw ForbiddenException with message The account is not active', async () => {
      account.isActive = false;
      const fn = service.validate.bind(service, user, account);

      expect(fn).toThrow(ForbiddenException);
      expect(fn).toThrow('The account is not active');
    });

    it('should throw ForbiddenException with custom not active error message', async () => {
      account.isActive = false;

      const fn = service.validate.bind(
        service,
        user,
        account,
        null,
        'custom not active error message',
      );

      expect(fn).toThrow(ForbiddenException);
      expect(fn).toThrow('custom not active error message');
    });

    it('should throw ForbiddenException with message "You do not have access to this account."', async () => {
      const fn = service.validate.bind(service, user, account);
      jest.spyOn(user, 'hasAccount').mockReturnValue(false);

      expect(fn).toThrow(ForbiddenException);
      expect(fn).toThrow('You do not have access to this account.');
    });

    it('should Not throw any error', async () => {
      const fn = service.validate.bind(service, user, account);
      jest.spyOn(user, 'hasAccount').mockReturnValue(true);

      expect(fn).not.toThrow();
    });
  });

  describe('addToBalance()', () => {
    const n: Decimal = new Decimal(0.5);
    const account: Account = { balance: new Decimal(55) } as Account;

    it('should add n to account balance', () => {
      expect(service.addToBalance(account, n).toNumber()).toBe(55.5);
    });
  });

  describe('subtractFromBalance()', () => {
    const n: Decimal = new Decimal(0.5);
    const account: Account = { balance: new Decimal(55) } as Account;

    it('should subtract n from account balance', () => {
      expect(service.subtractFromBalance(account, n).toNumber()).toBe(54.5);
    });
  });

  describe('isLessThanBalance()', () => {
    let n: Decimal;
    const account: Account = { balance: new Decimal(55) } as Account;

    beforeEach(() => (n = new Decimal(0)));

    it('should validate that balance is less than n return false', () => {
      n = new Decimal(54.9);
      expect(service.isBalanceLessThan(account, n)).toBe(false);
    });

    it('should validate that balance is not less than n it returns true', () => {
      n = new Decimal(55.1);
      expect(service.isBalanceLessThan(account, n)).toBe(true);
    });
  });
});
