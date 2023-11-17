import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../database/database.service';
import { UserUniqueInput } from '../users/users.repository';

export type ValidateUserInput = Omit<UserUniqueInput, 'id'> &
  Pick<User, 'password'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser({ password, ...rest }: ValidateUserInput) {
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
      access_token: this.jwtService.sign(payload),
    };
  }
}
