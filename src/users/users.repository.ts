import { Injectable } from '@nestjs/common';
import { DatabaseService, User } from '../database/database.service';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dtos/update-user.dto';

export type UserUniqueProp = Partial<Pick<User, 'id' | 'email' | 'username'>>;

@Injectable()
export class UsersRepository {
  constructor(private readonly DBContext: DatabaseService) {}

  async create(userData: CreateUserDto): Promise<User> {
    userData.password = await bcrypt.hash(userData.password, 12);

    return await this.DBContext.user.create({
      data: userData,
    });
  }

  async getOneBy(where: UserUniqueProp): Promise<User> {
    return await this.DBContext.user.findUnique({
      // @ts-ignore
      where,
    });
  }

  async updateOneById(id: number, userData: UpdateUserDto): Promise<User> {
    return await this.DBContext.user.update({ where: { id }, data: userData });
  }

  async deleteOneById(userId: number): Promise<User> {
    return await this.DBContext.user.delete({
      where: {
        id: userId,
      },
    });
  }

  async isValidPassword(
    currentHash: string,
    password: string,
  ): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, currentHash);
    return isMatch;
  }
}
