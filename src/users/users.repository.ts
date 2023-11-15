import { Injectable } from '@nestjs/common';
import { DatabaseService, User } from '../database/database.service';
import * as bcrypt from 'bcrypt';

export type CreatePropType = Omit<
  User,
  'id' | 'createdAt' | 'updatedAt' | 'role'
>;
export type UserUniqueProp = Partial<Pick<User, 'id' | 'email' | 'username'>>;
export type UpdateOneByIdPropType = Partial<
  Omit<User, 'id' | 'createdAt' | 'updatedAt'>
>;

@Injectable()
export class UsersRepository {
  constructor(private readonly DBContext: DatabaseService) {}

  async create(userData: CreatePropType): Promise<User> {
    userData.password = await this.hashPassword(userData.password);

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

  async updateOneById(id: number, data: UpdateOneByIdPropType): Promise<User> {
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
