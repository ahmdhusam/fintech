import { Injectable } from '@nestjs/common';
import { DatabaseService, User } from '../database/database.service';
import * as bcrypt from 'bcrypt';

export type CreateUserInput = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'role'
>;
export type UserUniqueInput = Partial<Pick<User, 'id' | 'email' | 'username'>>;
export type UpdateOneByIdInput = Partial<
  Omit<User, 'id' | 'createdAt' | 'updatedAt'>
>;

@Injectable()
export class UsersRepository {
  constructor(private readonly DBContext: DatabaseService) {}

  async create(userData: CreateUserInput): Promise<User> {
    userData.password = await this.hashPassword(userData.password);

    return await this.DBContext.user.create({
      data: userData,
    });
  }

  async getOneBy(where: UserUniqueInput): Promise<User> {
    return await this.DBContext.user.findUnique({
      // @ts-ignore
      where,
    });
  }

  async updateOneById(id: number, data: UpdateOneByIdInput): Promise<User> {
    return await this.DBContext.user.update({ where: { id }, data });
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

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }
}
