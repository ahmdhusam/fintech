import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Patch,
} from '@nestjs/common';
import { CurrentUser } from './users.decorator';
import { User } from 'src/database/database.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UsersService) {}

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
    } catch (err: any) {
      throw new BadRequestException();
    }
  }
}
