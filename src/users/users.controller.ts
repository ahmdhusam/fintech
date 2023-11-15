import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Logger,
  Patch,
} from '@nestjs/common';
import { CurrentUser } from './users.decorator';
import { User } from '../database/database.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { UseSerialize } from 'src/core/serialize/serialize.decorator';
import { UsersSerialize } from './dtos';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Users')
@UseSerialize(UsersSerialize)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

  @ApiOkResponse({
    description: 'The User data updated successfully',
    type: UsersSerialize,
  })
  @ApiConflictResponse({ description: 'username or email in use' })
  @Patch()
  async update(
    @CurrentUser() currentUser: User,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    try {
      const newData = await this.userService.update(currentUser.id, data);

      this.logger.log(
        `user: ${currentUser.username} change his data: ${JSON.stringify(
          data,
        )}`,
      );

      return newData;
    } catch (err) {
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('username or email in use');
        default: {
          this.logger.error('update throw: ', err.stack);
          throw new BadRequestException();
        }
      }
    }
  }
}
