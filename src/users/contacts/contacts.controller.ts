import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser } from '../users.decorator';
import { CreateContactDto } from './dtos/create-contact.dto';
import { Contact, User } from '../../database/database.service';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ContactsService } from './contacts.service';
import { UseSerialize } from 'src/core/serialize/serialize.decorator';
import { ContactSerialize } from './dtos/contact.serialize';

@ApiTags('Contacts')
@ApiBearerAuth()
@UseSerialize(ContactSerialize)
@Controller('users/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @ApiCreatedResponse({ type: ContactSerialize })
  @ApiConflictResponse({ description: 'Contact in use' })
  @ApiUnauthorizedResponse()
  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(
    @CurrentUser() currentUser: User,
    @Body() contact: CreateContactDto,
  ): Promise<Contact> {
    return await this.contactsService.create(currentUser, contact);
  }

  @ApiOkResponse({ type: ContactSerialize })
  @ApiNotFoundResponse({ description: 'Contact Not Found' })
  @ApiUnauthorizedResponse()
  @Get()
  async get(@CurrentUser() currentUser: User) {
    return await this.contactsService.getUserContacts(currentUser);
  }

  @ApiOkResponse({ type: ContactSerialize })
  @ApiNotFoundResponse({ description: 'Contact Not Found' })
  @ApiForbiddenResponse({ description: 'Not Allowed' })
  @ApiUnauthorizedResponse()
  @Delete()
  async delete(
    @CurrentUser() currentUser: User,
    @Query('contactId', ParseIntPipe) contactId: number,
  ): Promise<Contact> {
    return await this.contactsService.deleteOne(currentUser, contactId);
  }

  @ApiOkResponse({ type: ContactSerialize })
  @ApiNotFoundResponse({ description: 'Contact Not Found' })
  @ApiForbiddenResponse({ description: 'Not Allowed' })
  @ApiUnauthorizedResponse()
  @Put()
  async editContact(
    @CurrentUser() currentUser: User,
    @Query('contactId', ParseIntPipe) contactId: number,
    data: CreateContactDto,
  ): Promise<Contact> {
    return await this.contactsService.modifyContact(
      currentUser,
      contactId,
      data,
    );
  }
}
