import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { Account, DatabaseService, User } from '../database/database.service';
import { AccountsRepository } from './accounts.repository';

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: AccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        AccountsService,
        AccountsRepository,
        {
          provide: DatabaseService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get<AccountsService>(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    it('should call AccountsService.create()', async () => {
      jest.spyOn(service, 'create').mockResolvedValue({} as Account);

      await controller.create({} as User);

      expect(service.create).toHaveBeenCalled();
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAll()', () => {
    it('should call AccountsService.getAll()', async () => {
      jest.spyOn(service, 'getAll').mockResolvedValue({} as Account[]);

      await controller.getAll({} as User);

      expect(service.getAll).toHaveBeenCalled();
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteOne()', () => {
    it('should call AccountsService.deleteOne()', async () => {
      jest.spyOn(service, 'deleteOne').mockResolvedValue({} as Account);

      await controller.deleteOne({} as User, 1);

      expect(service.deleteOne).toHaveBeenCalled();
      expect(service.deleteOne).toHaveBeenCalledTimes(1);
    });
  });
});
