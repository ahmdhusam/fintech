import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { User } from '../database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly userRepo: UsersRepository) {}

  async create(userData: CreateUserDto): Promise<User> {
    return await this.userRepo.create(userData);
  }

  async get(
    where: Partial<Pick<User, 'id' | 'email' | 'username'>>,
  ): Promise<User> {
    return await this.userRepo.getOneBy(where);
  }

  async update(userId: number, userData: UpdateUserDto): Promise<User> {
    return await this.userRepo.updateOneById(userId, userData);
  }

  async delete(userId: number): Promise<User> {
    return await this.userRepo.deleteOneById(userId);
  }
}
