import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CurrentUser } from 'src/users/users.decorator';
import { Account, User } from '../database/database.service';
import { UseSerialize } from 'src/core/serialize/serialize.decorator';
import { AccountsSerialize } from './dtos/accounts.serialize';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseSerialize(AccountsSerialize)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiCreatedResponse({ type: AccountsSerialize })
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@CurrentUser() currentUser: User): Promise<Account> {
    return await this.accountsService.create(currentUser);
  }

  @ApiOkResponse({ type: AccountsSerialize })
  @ApiUnauthorizedResponse()
  @Get()
  async getAll(@CurrentUser() currentUser: User) {
    return await this.accountsService.getAll(currentUser);
  }

  @ApiOkResponse({ type: AccountsSerialize })
  @ApiNotFoundResponse({ description: 'Account Not Found' })
  @ApiForbiddenResponse({ description: 'Not Allowed' })
  @ApiUnauthorizedResponse()
  @Delete()
  async deleteOne(
    @CurrentUser() currentUser: User,
    @Query('accountId', ParseIntPipe) accountId: number,
  ): Promise<Account> {
    return await this.accountsService.deleteOne(currentUser, accountId);
  }
}
