import { Injectable, Logger } from '@nestjs/common';
import {
  CreateUserInput,
  UpdateOneByIdInput,
  UserUniqueInput,
  UsersRepository,
} from './users.repository';
import { User } from '../database/database.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepo: UsersRepository) {}

  async create(userData: CreateUserInput): Promise<User> {
    return await this.userRepo.create(userData);
  }

  async getOneBy(where: UserUniqueInput): Promise<User> {
    return await this.userRepo.getOneBy(where);
  }

  async update(userId: number, userData: UpdateOneByIdInput): Promise<User> {
    return await this.userRepo.updateOneById(userId, userData);
  }

  async delete(userId: number): Promise<User> {
    return await this.userRepo.deleteOneById(userId);
  }

  async isValidPassword(
    currentHash: string,
    password: string,
  ): Promise<boolean> {
    return await this.userRepo.isValidPassword(currentHash, password);
  }

  async changePassword(
    user: User,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const isMatch = await this.isValidPassword(user.password, currentPassword);
    if (!isMatch) return false;

    const hashed = await this.userRepo.hashPassword(newPassword);

    await this.update(user.id, { password: hashed });

    return true;
  }

  async changeEmail(
    user: User,
    currentPassword: string,
    newEmail: string,
  ): Promise<User> {
    const isMatch = await this.isValidPassword(user.password, currentPassword);
    if (!isMatch) return null;

    return await this.update(user.id, { email: newEmail });
  }
}
