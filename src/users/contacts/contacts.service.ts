import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactsRepository, CreateContactInput } from './contacts.repository';
import { Contact, User } from '../../database/database.service';

@Injectable()
export class ContactsService {
  constructor(private readonly contactsRepo: ContactsRepository) {}

  async create(user: User, data: CreateContactInput): Promise<Contact> {
    return await this.contactsRepo.create(user.id, data).catch((err) => {
      switch (err.code) {
        case 'P2002':
          throw new ConflictException('Contact in use');
        default:
          throw new BadRequestException();
      }
    });
  }

  async getUserContacts(user: User): Promise<Contact[]> {
    const contact = await this.contactsRepo.getBy({ userId: user.id });

    if (!contact) throw new NotFoundException('Contact Not Found');

    return contact;
  }

  async deleteOne(user: User, contactId: number): Promise<Contact> {
    const contact = await this.contactsRepo.getOneById(contactId);

    if (!contact) throw new NotFoundException('Contact Not Found');

    if (contact.userId !== user.id) throw new ForbiddenException('Not Allowed');

    return await this.contactsRepo.deleteOneById(contactId);
  }

  async modifyContact(
    user: User,
    contactId: number,
    data: CreateContactInput,
  ): Promise<Contact> {
    const contact = await this.contactsRepo.getOneById(contactId);

    if (!contact) throw new NotFoundException('Contact Not Found');

    if (contact.userId !== user.id) throw new ForbiddenException('Not Allowed');

    return await this.contactsRepo.updateOneById(contactId, data);
  }
}
