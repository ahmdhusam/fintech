import { Injectable } from '@nestjs/common';
import { Contact, DatabaseService } from '../../database/database.service';

export type CreateContactInput = Omit<
  Contact,
  'id' | 'createdAt' | 'updatedAt' | 'userId' | 'User'
>;

export type GetContactInput = Partial<Pick<Contact, 'id' | 'userId'>>;

@Injectable()
export class ContactsRepository {
  constructor(private readonly DBContext: DatabaseService) {}

  async create(userId: number, data: CreateContactInput): Promise<Contact> {
    return await this.DBContext.contact.create({ data: { userId, ...data } });
  }

  async getBy(where: GetContactInput): Promise<Contact[]> {
    return await this.DBContext.contact.findMany({ where });
  }

  async getOneById(contactId: number): Promise<Contact> {
    return await this.DBContext.contact.findUnique({
      where: { id: contactId },
    });
  }

  async deleteOneById(contactId: number): Promise<Contact> {
    return await this.DBContext.contact.delete({ where: { id: contactId } });
  }

  async updateOneById(
    contactId: number,
    data: CreateContactInput,
  ): Promise<Contact> {
    return await this.DBContext.contact.update({
      where: { id: contactId },
      data,
    });
  }
}
