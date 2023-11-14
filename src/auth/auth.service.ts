import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '../database/database.service';
import { UserUniqueProp } from 'src/users/users.repository';

export type ValidateUserType = Omit<UserUniqueProp, 'id'> &
  Pick<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly JwtService: JwtService,
  ) {}

  async validateUser({ password, ...rest }: ValidateUserType) {
    const user = await this.usersService.getOneBy(rest);
    if (!user) return null;

    const isMatch = await this.usersService.isValidPassword(
      user.password,
      password,
    );
    if (!isMatch) return null;

    return user;
  }

  makeToken(id: number) {
    const payload = { sub: id };
    return {
      access_token: this.JwtService.sign(payload),
    };
  }
}
