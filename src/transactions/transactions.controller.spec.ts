import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { AccountsService } from '../accounts/accounts.service';
import {
  Account,
  DatabaseService,
  Decimal,
  Transaction,
  User,
} from '../database/database.service';
import { TransactionDto } from './dtos/transaction-data.dto';
import { AccountsRepository } from '../accounts/accounts.repository';
import { ConflictException, ForbiddenException } from '@nestjs/common';
import { TransferDto } from './dtos/transfer.dto';

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let transactionsService: TransactionsService;
  let accountsService: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        TransactionsService,
        AccountsService,
        { provide: DatabaseService, useValue: {} },
        { provide: AccountsRepository, useValue: {} },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    accountsService = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('deposit()', () => {
    const user = {} as User;
    const account = { id: 1 } as Account;
    const data = { accountId: 1, amount: new Decimal(0) } as TransactionDto;

    beforeEach(() => {
      jest.spyOn(accountsService, 'getOneById').mockResolvedValue(account);
      jest.spyOn(accountsService, 'validate').mockReturnValue();
      jest
        .spyOn(transactionsService, 'calcTax')
        .mockReturnValue(new Decimal(0));
      jest
        .spyOn(transactionsService, 'createDeposit')
        .mockResolvedValue({} as Transaction);
    });

    it('should call AccountsService.getOneById()', async () => {
      await controller.deposit(user, data);

      expect(accountsService.getOneById).toHaveBeenCalled();
      expect(accountsService.getOneById).toHaveBeenCalledTimes(1);
    });

    it('should call TransactionsService.calcTax()', async () => {
      await controller.deposit(user, data);

      expect(transactionsService.calcTax).toHaveBeenCalled();
      expect(transactionsService.calcTax).toHaveBeenCalledTimes(1);
    });

    it('should call TransactionsService.createDeposit()', async () => {
      await controller.deposit(user, data);

      expect(transactionsService.createDeposit).toHaveBeenCalled();
      expect(transactionsService.createDeposit).toHaveBeenCalledTimes(1);
    });
  });

  describe('withdraw()', () => {
    const user = {} as User;
    const account = { id: 1 } as Account;
    const data = { accountId: 1, amount: new Decimal(0) } as TransactionDto;

    beforeEach(() => {
      jest.spyOn(accountsService, 'getOneById').mockResolvedValue(account);
      jest.spyOn(accountsService, 'validate').mockReturnValue();
      jest.spyOn(accountsService, 'isBalanceLessThan').mockReturnValue(false);

      jest
        .spyOn(transactionsService, 'calcGross')
        .mockReturnValue(new Decimal(0));
      jest
        .spyOn(transactionsService, 'createWithdraw')
        .mockResolvedValue({} as Transaction);
    });

    it('should call AccountsService.getOneById()', async () => {
      await controller.withdraw(user, data);

      expect(accountsService.getOneById).toHaveBeenCalled();
      expect(accountsService.getOneById).toHaveBeenCalledTimes(1);
    });

    it('should call AccountsService.validate()', async () => {
      await controller.withdraw(user, data);

      expect(accountsService.validate).toHaveBeenCalled();
      expect(accountsService.validate).toHaveBeenCalledTimes(1);
    });

    it('should call TransactionsService.calcGross()', async () => {
      await controller.withdraw(user, data);

      expect(transactionsService.calcGross).toHaveBeenCalled();
      expect(transactionsService.calcGross).toHaveBeenCalledTimes(1);
    });

    it('should call AccountsService.isBalanceLessThan()', async () => {
      await controller.withdraw(user, data);

      expect(accountsService.isBalanceLessThan).toHaveBeenCalled();
      expect(accountsService.isBalanceLessThan).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException with error message "Your account does not have enough balance (${grossAmount}) for this transaction." when AccountsService.isBalanceLessThan() returns true', async () => {
      const grossAmount = new Decimal(54);

      jest.spyOn(transactionsService, 'calcGross').mockReturnValue(grossAmount);
      jest.spyOn(accountsService, 'isBalanceLessThan').mockReturnValue(true);

      expect(controller.withdraw(user, data)).rejects.toThrow(
        ForbiddenException,
      );
      expect(controller.withdraw(user, data)).rejects.toThrow(
        `Your account does not have enough balance (${grossAmount}) for this transaction.`,
      );
    });

    it('should call TransactionsService.createWithdraw()', async () => {
      await controller.withdraw(user, data);

      expect(transactionsService.createWithdraw).toHaveBeenCalled();
      expect(transactionsService.createWithdraw).toHaveBeenCalledTimes(1);
    });
  });

  describe('transfer()', () => {
    const user = {} as User;
    const sender = { id: 1 } as Account;
    const receiver = { id: 2 } as Account;
    const data = {
      accountId: 1,
      accountKey: '',
      amount: new Decimal(0),
    } as TransferDto;

    beforeEach(() => {
      jest.spyOn(accountsService, 'getOneById').mockResolvedValue(sender);
      jest.spyOn(accountsService, 'getOneBy').mockResolvedValue(receiver);
      jest.spyOn(accountsService, 'validate').mockReturnValue();
      jest.spyOn(accountsService, 'isBalanceLessThan').mockReturnValue(false);

      jest
        .spyOn(transactionsService, 'calcGross')
        .mockReturnValue(new Decimal(0));
      jest
        .spyOn(transactionsService, 'createTransfer')
        .mockResolvedValue({} as Transaction);
    });

    it('should call AccountsService.getOneById()', async () => {
      await controller.transfer(user, data);

      expect(accountsService.getOneById).toHaveBeenCalled();
      expect(accountsService.getOneById).toHaveBeenCalledTimes(1);
    });

    it('should call AccountsService.getOneBy()', async () => {
      await controller.transfer(user, data);

      expect(accountsService.getOneBy).toHaveBeenCalled();
      expect(accountsService.getOneBy).toHaveBeenCalledTimes(1);
    });

    it('should call AccountsService.validate()', async () => {
      await controller.transfer(user, data);

      expect(accountsService.validate).toHaveBeenCalled();
      expect(accountsService.validate).toHaveBeenCalledTimes(2);
    });

    it('should validate that the transferring to the same account is not possible', async () => {
      jest.spyOn(accountsService, 'getOneBy').mockResolvedValue(sender);

      expect(controller.transfer(user, data)).rejects.toThrow(
        ConflictException,
      );
      expect(controller.transfer(user, data)).rejects.toThrow(
        'Transferring to the same account is not possible',
      );
    });

    it('should call TransactionsService.calcGross()', async () => {
      await controller.transfer(user, data);

      expect(transactionsService.calcGross).toHaveBeenCalled();
      expect(transactionsService.calcGross).toHaveBeenCalledTimes(1);
    });

    it('should call AccountsService.isBalanceLessThan()', async () => {
      await controller.transfer(user, data);

      expect(accountsService.isBalanceLessThan).toHaveBeenCalled();
      expect(accountsService.isBalanceLessThan).toHaveBeenCalledTimes(1);
    });

    it('should throw ForbiddenException with error message "Your account does not have enough balance (${grossAmount}) for this transaction." when AccountsService.isBalanceLessThan() returns true', async () => {
      const grossAmount = new Decimal(54);

      jest.spyOn(transactionsService, 'calcGross').mockReturnValue(grossAmount);
      jest.spyOn(accountsService, 'isBalanceLessThan').mockReturnValue(true);

      expect(controller.transfer(user, data)).rejects.toThrow(
        ForbiddenException,
      );
      expect(controller.transfer(user, data)).rejects.toThrow(
        `Your account does not have enough balance (${grossAmount}) for this transaction.`,
      );
    });

    it('should call transactionsService.createTransfer()', async () => {
      await controller.transfer(user, data);

      expect(transactionsService.createTransfer).toHaveBeenCalled();
      expect(transactionsService.createTransfer).toHaveBeenCalledTimes(1);
    });
  });
});
