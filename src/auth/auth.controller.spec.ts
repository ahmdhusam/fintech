import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User } from '../database/database.service';
import { CreateUserDto } from '../users/dtos';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: UsersService, useValue: { create: () => {} } },
        { provide: AuthService, useValue: { makeToken: () => {} } },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register()', () => {
    it('should call UsersService.create()', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue({} as User);

      await controller.register({} as CreateUserDto);

      expect(usersService.create).toHaveBeenCalled();
      expect(usersService.create).toHaveBeenCalledTimes(1);
    });

    it('should return an object with message property', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue({} as User);

      const result = await controller.register({} as CreateUserDto);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('message');
    });

    it('should throw ConflictException when the username or email in use', async () => {
      jest.spyOn(usersService, 'create').mockRejectedValue({ code: 'P2002' });

      expect(controller.register({} as CreateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(controller.register({} as CreateUserDto)).rejects.toThrow(
        'username or email in use',
      );
    });

    it('should throw BadRequestException when the username or email not in use', async () => {
      jest.spyOn(usersService, 'create').mockRejectedValue({ code: '' });

      expect(controller.register({} as CreateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('login()', () => {
    it('should call AuthService.makeToken()', async () => {
      jest.spyOn(authService, 'makeToken').mockReturnValue({} as any);

      await controller.login({} as User);

      expect(authService.makeToken).toHaveBeenCalled();
      expect(authService.makeToken).toHaveBeenCalledTimes(1);
    });
  });
});
