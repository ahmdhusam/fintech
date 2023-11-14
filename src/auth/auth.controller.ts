import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthSerialize } from './dtos';
import { SkipAuth, UseLocalGaurd } from './guards';
import { UseSerialize } from '../core/serialize/serialize.decorator';
import { CreateUserDto } from '../users/dtos';
import { UsersService } from '../users/users.service';
import { Request } from 'express';

@UseSerialize(AuthSerialize)
@SkipAuth()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    try {
      await this.usersService.create(createUser);
      return { message: 'success' };
    } catch (err) {
      this.logger.error('register throw: ', err.stack);
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('username or email in use');
        default:
          throw new BadRequestException();
      }
    }
  }

  @HttpCode(HttpStatus.OK)
  @UseLocalGaurd()
  @Post('login')
  async login(@Req() req: any) {
    console.log('login');
    return this.authService.makeToken(req.user?.id as number);
  }
}
