import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthSerialize } from './dtos';
import { SkipAuth, UseLocalGaurd } from './guards';
import { UseSerialize } from '../core/serialize/serialize.decorator';
import { CreateUserDto } from '../users/dtos';
import { UsersService } from '../users/users.service';
import { CurrentUser } from '../users/users.decorator';
import { User } from '../database/database.service';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GlobalSerialize } from '../core/dtos/global.serialize';
import { LocalAuthDto } from './dtos/localAuth.dto';

@ApiTags('Auth')
@SkipAuth()
@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiCreatedResponse({ type: GlobalSerialize })
  @ApiConflictResponse({ description: 'username or email in use' })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createUser: CreateUserDto) {
    try {
      await this.usersService.create(createUser);
      return { message: 'success' };
    } catch (err) {
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('username or email in use');
        default:
          this.logger.error('register throw: ', err.stack);
          throw new BadRequestException();
      }
    }
  }

  @ApiOkResponse({ type: AuthSerialize })
  @ApiBadRequestResponse()
  @ApiBody({ type: LocalAuthDto })
  @ApiBasicAuth()
  @HttpCode(HttpStatus.OK)
  @UseSerialize(AuthSerialize)
  @UseLocalGaurd()
  @Post('login')
  async login(@CurrentUser() currentUser: User) {
    return this.authService.makeToken(currentUser.id);
  }
}
