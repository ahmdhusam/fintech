import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import {
  UpdateOneByIdInput,
  UserUniqueInput,
  UsersRepository,
} from './users.repository';
import { User } from '../database/database.service';
import { CreateUserDto } from './dtos';

describe('UserService', () => {
  let service: UsersService;
  let usersRepo: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            create: () => {},
            getOneBy: () => {},
            updateOneById: () => {},
            deleteOneById: () => {},
            isValidPassword: () => {},
            hashPassword: () => {},
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepo = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    it('should call UsersRepository.create()', async () => {
      jest.spyOn(usersRepo, 'create').mockResolvedValue({} as User);

      await service.create({} as CreateUserDto);

      expect(usersRepo.create).toHaveBeenCalled();
      expect(usersRepo.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getOneBy()', () => {
    it('should call UsersRepository.getOneBy()', async () => {
      jest.spyOn(usersRepo, 'getOneBy').mockResolvedValue({} as User);

      await service.getOneBy({} as UserUniqueInput);

      expect(usersRepo.getOneBy).toHaveBeenCalled();
      expect(usersRepo.getOneBy).toHaveBeenCalledTimes(1);
    });
  });

  describe('update()', () => {
    it('should call UsersRepository.updateOneById()', async () => {
      jest.spyOn(usersRepo, 'updateOneById').mockResolvedValue({} as User);

      await service.update(1, {} as UpdateOneByIdInput);

      expect(usersRepo.updateOneById).toHaveBeenCalled();
      expect(usersRepo.updateOneById).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete()', () => {
    it('should call UsersRepository.deleteOneById()', async () => {
      jest.spyOn(usersRepo, 'deleteOneById').mockResolvedValue({} as User);

      await service.delete(1);

      expect(usersRepo.deleteOneById).toHaveBeenCalled();
      expect(usersRepo.deleteOneById).toHaveBeenCalledTimes(1);
    });
  });

  describe('isValidPassword()', () => {
    it('should call UsersRepository.isValidPassword()', async () => {
      jest.spyOn(usersRepo, 'isValidPassword').mockResolvedValue(false);

      await service.isValidPassword('', '');

      expect(usersRepo.isValidPassword).toHaveBeenCalled();
      expect(usersRepo.isValidPassword).toHaveBeenCalledTimes(1);
    });
  });

  describe('changePassword()', () => {
    const user = { id: 1, password: '' } as User;

    it('should call UsersService.isValidPassword()', async () => {
      jest.spyOn(service, 'isValidPassword').mockResolvedValue(false);

      await service.changePassword(user, '', '');

      expect(service.isValidPassword).toHaveBeenCalled();
      expect(service.isValidPassword).toHaveBeenCalledTimes(1);
    });

    it('should return false if the UsersService.isValidPassword() returns false', async () => {
      jest.spyOn(service, 'isValidPassword').mockResolvedValue(false);

      expect(service.changePassword(user, '', '')).resolves.toBe(false);
    });

    it('should hash the new password if the current password is valid', async () => {
      jest.spyOn(service, 'isValidPassword').mockResolvedValue(true);
      jest.spyOn(usersRepo, 'hashPassword').mockResolvedValue('hashedValue');
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await service.changePassword(user, '', '');

      expect(usersRepo.hashPassword).toHaveBeenCalled();
      expect(usersRepo.hashPassword).toHaveBeenCalledTimes(1);
    });

    it('should call UsersService.update()', async () => {
      jest.spyOn(service, 'isValidPassword').mockResolvedValue(true);
      jest.spyOn(usersRepo, 'hashPassword').mockResolvedValue('');
      jest.spyOn(service, 'update').mockResolvedValue(null);

      const result = await service.changePassword(user, '', '');

      expect(result).toBe(true);

      expect(service.update).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('changeEmail()', () => {
    const user = { id: 1, password: '' } as User;

    it('should UsersService.isValidPassword()', async () => {
      jest.spyOn(service, 'isValidPassword').mockResolvedValue(false);

      await service.changeEmail(user, '', '');

      expect(service.isValidPassword).toHaveBeenCalled();
      expect(service.isValidPassword).toHaveBeenCalledTimes(1);
    });

    it('should return null if the UsersService.isValidPassword() returns false', async () => {
      jest.spyOn(service, 'isValidPassword').mockResolvedValue(false);

      expect(service.changeEmail(user, '', '')).resolves.toBeNull();
    });

    it('should call UsersService.update() if the UsersService.isValidPassword() returns true', async () => {
      jest.spyOn(service, 'isValidPassword').mockResolvedValue(true);
      jest.spyOn(service, 'update').mockResolvedValue(user);

      expect(service.changeEmail(user, '', '')).resolves.toBe(user);
    });
  });
});
