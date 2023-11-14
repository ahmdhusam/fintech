import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AuthService, ValidateUserType } from '../auth.service';
import { isEmail } from 'class-validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'usernameOrEmail' });
  }

  async validate(usernameOrEmail: string, password: string): Promise<any> {
    const claims: ValidateUserType = { password };

    if (isEmail(usernameOrEmail)) claims.email = usernameOrEmail;
    else claims.username = usernameOrEmail;

    const user = await this.authService.validateUser(claims);

    if (!user) {
      throw new BadRequestException();
    }
    return user;
  }
}
