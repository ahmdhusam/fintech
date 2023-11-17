import { Test, TestingModule } from '@nestjs/testing';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactsRepository } from './contacts.repository';
import { Contact, User } from '../../database/database.service';
import { CreateContactDto } from './dtos/create-contact.dto';

describe('ContactsController', () => {
  let controller: ContactsController;
  let contactsService: ContactsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactsController],
      providers: [
        ContactsService,
        { provide: ContactsRepository, useValue: {} },
      ],
    }).compile();

    controller = module.get<ContactsController>(ContactsController);
    contactsService = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create()', () => {
    const user = {} as User;
    const contact = { id: 1 } as Contact;

    it('should call ContactsService.create()', async () => {
      jest.spyOn(contactsService, 'create').mockResolvedValue(contact);

      const result = await controller.create(user, {} as CreateContactDto);

      expect(result).toHaveProperty('id');
      expect(result.id).toBe(contact.id);
      expect(contactsService.create).toHaveBeenCalled();
      expect(contactsService.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('get()', () => {
    const user = {} as User;
    const contact = [{ id: 1 }] as Contact[];

    it('should call ContactsService.getUserContacts()', async () => {
      jest.spyOn(contactsService, 'getUserContacts').mockResolvedValue(contact);

      const result = await controller.get(user);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id');
      expect(result[0].id).toBe(contact[0].id);
      expect(contactsService.getUserContacts).toHaveBeenCalled();
      expect(contactsService.getUserContacts).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete()', () => {
    const user = {} as User;
    const contact = { id: 1 } as Contact;

    it('should call ContactsService.deleteOne()', async () => {
      jest.spyOn(contactsService, 'deleteOne').mockResolvedValue(contact);

      const result = await controller.delete(user, 1);

      expect(result).toHaveProperty('id');
      expect(result.id).toBe(contact.id);
      expect(contactsService.deleteOne).toHaveBeenCalled();
      expect(contactsService.deleteOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('editContact()', () => {
    const user = {} as User;
    const contact = { id: 1 } as Contact;

    it('should call ContactsService.modifyContact()', async () => {
      jest.spyOn(contactsService, 'modifyContact').mockResolvedValue(contact);

      const result = await controller.editContact(
        user,
        1,
        {} as CreateContactDto,
      );

      expect(result).toHaveProperty('id');
      expect(result.id).toBe(contact.id);
      expect(contactsService.modifyContact).toHaveBeenCalled();
      expect(contactsService.modifyContact).toHaveBeenCalledTimes(1);
    });
  });
});
