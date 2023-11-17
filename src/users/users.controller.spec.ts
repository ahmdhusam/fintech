import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { User } from '../database/database.service';
import { UpdateUserDto } from './dtos';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ChangeEmailDto } from './dtos/change-email.dto';

describe('UserController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, { provide: UsersRepository, useValue: {} }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('update()', () => {
    const user = { id: 1 } as User;

    it('should call UsersService.update()', async () => {
      jest.spyOn(service, 'update').mockResolvedValue(user);

      expect(controller.update(user, {} as UpdateUserDto)).resolves.toBe(user);
      expect(service.update).toHaveBeenCalled();
      expect(service.update).toHaveBeenCalledTimes(1);
    });

    it('should throw a ConflictException with message "username in use" if the update throws error with code "P2002"', async () => {
      jest.spyOn(service, 'update').mockRejectedValue({ code: 'P2002' });

      expect(controller.update(user, {} as UpdateUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(controller.update(user, {} as UpdateUserDto)).rejects.toThrow(
        'username in use',
      );
    });

    it('should throws BadRequestException if the update error code is not "P2002"', async () => {
      jest.spyOn(service, 'update').mockRejectedValue({ code: '' });

      expect(controller.update(user, {} as UpdateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('changePassword()', () => {
    const passwords = { newPassword: '', password: '' };

    it('should call UsersService.changePassword()', async () => {
      jest.spyOn(service, 'changePassword').mockResolvedValue(true);

      await controller.changePassword({} as User, passwords);

      expect(service.changePassword).toHaveBeenCalled();
      expect(service.changePassword).toHaveBeenCalledTimes(1);
    });

    it('should throw a ForbiddenException with message "Password does not match." if UsersService.changePassword() returns false', async () => {
      jest.spyOn(service, 'changePassword').mockResolvedValue(false);

      expect(controller.changePassword({} as User, passwords)).rejects.toThrow(
        ForbiddenException,
      );
      expect(controller.changePassword({} as User, passwords)).rejects.toThrow(
        'Password does not match.',
      );
    });

    it('should return an object with message property if the password changed successfully', async () => {
      jest.spyOn(service, 'changePassword').mockResolvedValue(true);

      const result = await controller.changePassword({} as User, passwords);
      expect(result).toHaveProperty('message');
    });
  });

  describe('changeEmail()', () => {
    const data = { email: '', password: '' } as ChangeEmailDto;
    const user = {} as User;

    it('should call UsersService.changeEmail()', async () => {
      jest.spyOn(service, 'changeEmail').mockResolvedValue(user);

      await controller.changeEmail({} as User, data);

      expect(service.changeEmail).toHaveBeenCalled();
      expect(service.changeEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw a ForbiddenException with message "Password does not match." if UsersService.changeEmail() returns null', async () => {
      jest.spyOn(service, 'changeEmail').mockResolvedValue(null);

      expect(controller.changeEmail({} as User, data)).rejects.toThrow(
        ForbiddenException,
      );
      expect(controller.changeEmail({} as User, data)).rejects.toThrow(
        'Password does not match.',
      );
    });

    it('should return an object with updated data if the user email changed successfully', async () => {
      jest.spyOn(service, 'changeEmail').mockResolvedValue(user);

      const result = await controller.changeEmail({} as User, data);

      expect(result).toBe(user);
    });
  });
});
