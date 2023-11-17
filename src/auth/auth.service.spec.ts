import { Test, TestingModule } from '@nestjs/testing';
import { AuthService, ValidateUserInput } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../database/database.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            getOneBy: () => {},
            isValidPassword: () => {},
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => {},
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser()', () => {
    const user = { password: '' } as User;
    const input = {} as ValidateUserInput;

    it('should call UsersService.getOneBy()', async () => {
      jest.spyOn(usersService, 'getOneBy').mockResolvedValue(null);

      await service.validateUser(input);

      expect(usersService.getOneBy).toHaveBeenCalled();
      expect(usersService.getOneBy).toHaveBeenCalledTimes(1);
    });

    it('should return null if user not found', async () => {
      jest.spyOn(usersService, 'getOneBy').mockResolvedValue(null);

      expect(service.validateUser(input)).resolves.toBeNull();
    });

    it('should call UsersService.isValidPassword()', async () => {
      jest.spyOn(usersService, 'getOneBy').mockResolvedValue(user);
      jest.spyOn(usersService, 'isValidPassword').mockResolvedValue(false);

      await service.validateUser(input);

      expect(usersService.isValidPassword).toHaveBeenCalled();
      expect(usersService.isValidPassword).toHaveBeenCalledTimes(1);
    });

    it('should return null if password not match with user password', async () => {
      jest.spyOn(usersService, 'isValidPassword').mockResolvedValue(false);

      expect(service.validateUser(input)).resolves.toBeNull();
    });

    it('should return user if password matched with user password', async () => {
      jest.spyOn(usersService, 'getOneBy').mockResolvedValue(user);
      jest.spyOn(usersService, 'isValidPassword').mockResolvedValue(true);

      expect(service.validateUser(input)).resolves.toBe(user);
    });
  });

  describe('makeToken()', () => {
    it('should call JwtService.sign()', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValue('');

      service.makeToken(1);

      expect(jwtService.sign).toHaveBeenCalled();
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
    });

    it('should return an object that has access_token property', async () => {
      const token = 'token';

      jest.spyOn(jwtService, 'sign').mockReturnValue(token);

      const result = service.makeToken(1);

      expect(result).toHaveProperty('access_token');
      expect(result.access_token).toBe(token);
    });
  });
});
