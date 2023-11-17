import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { DatabaseService, Decimal } from '../database/database.service';

describe('TransactionsService', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: DatabaseService, useValue: {} },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calcTax()', () => {
    it('should subtract tax from amount', () => {
      const amount = 51.3;

      expect(service.calcTax(new Decimal(amount)).toNumber()).toEqual(
        amount - TransactionsService.TAX,
      );
    });
  });

  describe('calcGross()', () => {
    it('should add tax to amount', () => {
      const amount = 51.3;

      expect(service.calcGross(new Decimal(amount)).toNumber()).toEqual(
        amount + TransactionsService.TAX,
      );
    });
  });
});
