import { Test, TestingModule } from '@nestjs/testing';
import { ContactsService } from './contacts.service';
import { ContactsRepository, CreateContactInput } from './contacts.repository';
import {
  Contact,
  DatabaseService,
  User,
} from '../../database/database.service';
import { CreateContactDto } from './dtos/create-contact.dto';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('ContactsService', () => {
  let service: ContactsService;
  let contactsRepo: ContactsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactsService,
        ContactsRepository,
        { provide: DatabaseService, useValue: {} },
      ],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
    contactsRepo = module.get<ContactsRepository>(ContactsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create()', () => {
    const user = {} as User;
    const data = {} as CreateContactDto;

    it('should call ContactsRepository.create()', async () => {
      jest.spyOn(contactsRepo, 'create').mockResolvedValue({} as Contact);

      await service.create(user, data);

      expect(contactsRepo.create).toHaveBeenCalled();
      expect(contactsRepo.create).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException when the Contact in use', async () => {
      jest.spyOn(contactsRepo, 'create').mockRejectedValue({ code: 'P2002' });

      expect(service.create(user, data)).rejects.toThrow(ConflictException);
      expect(service.create(user, data)).rejects.toThrow('Contact in use');
    });

    it('should throws BadRequestException if the update error code is not "P2002"', async () => {
      jest.spyOn(contactsRepo, 'create').mockRejectedValue({ code: '' });

      expect(service.create(user, data)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUserContacts()', () => {
    const user = { id: 1 } as User;

    it('should call ContactsRepo.getBy()', async () => {
      const contact = [{}] as Contact[];
      jest.spyOn(contactsRepo, 'getBy').mockResolvedValue(contact);

      const result = await service.getUserContacts(user);

      expect(result).toBe(contact);
      expect(contactsRepo.getBy).toHaveBeenCalled();
      expect(contactsRepo.getBy).toHaveBeenCalledTimes(1);
    });

    it('should throw a NotFoundException with error message "Contacts Not Found" when the ContactsRepo.getBy() returns null', async () => {
      jest.spyOn(contactsRepo, 'getBy').mockResolvedValue(null);

      expect(service.getUserContacts(user)).rejects.toThrow(NotFoundException);
      expect(service.getUserContacts(user)).rejects.toThrow(
        'Contacts Not Found',
      );
    });
  });

  describe('deleteOne()', () => {
    const contact = {} as Contact;
    const user = {} as User;

    beforeEach(() => {
      jest.spyOn(contactsRepo, 'getOneById').mockResolvedValue(contact);
      jest.spyOn(service, 'validate').mockReturnThis();
      jest.spyOn(contactsRepo, 'deleteOneById').mockResolvedValue(contact);
    });

    it('should call ContactsRepo.getOneById()', async () => {
      await service.deleteOne(user, 1);

      expect(contactsRepo.getOneById).toHaveBeenCalled();
      expect(contactsRepo.getOneById).toHaveBeenCalledTimes(1);
    });

    it('should call ContactsService.validate()', async () => {
      await service.deleteOne(user, 1);

      expect(service.validate).toHaveBeenCalled();
      expect(service.validate).toHaveBeenCalledTimes(1);
    });

    it('should call ContactsRepo.deleteOneById()', async () => {
      await service.deleteOne(user, 1);

      expect(contactsRepo.deleteOneById).toHaveBeenCalled();
      expect(contactsRepo.deleteOneById).toHaveBeenCalledTimes(1);
    });

    it('should return returns the deleted contact', async () => {
      const result = await service.deleteOne(user, 1);

      expect(result).toBe(contact);
    });
  });

  describe('modifyContact()', () => {
    const user = {} as User;
    const data = {} as CreateContactInput;
    const contact = {} as Contact;

    beforeEach(async () => {
      jest.spyOn(contactsRepo, 'getOneById').mockResolvedValue(contact);
      jest.spyOn(service, 'validate').mockReturnThis();
      jest.spyOn(contactsRepo, 'updateOneById').mockResolvedValue(contact);
    });

    it('should call ContactsRepo.getOneById()', async () => {
      await service.modifyContact(user, 1, data);

      expect(contactsRepo.getOneById).toHaveBeenCalled();
      expect(contactsRepo.getOneById).toHaveBeenCalledTimes(1);
    });

    it('should call ContactsService.validate()', async () => {
      await service.modifyContact(user, 1, data);

      expect(service.validate).toHaveBeenCalled();
      expect(service.validate).toHaveBeenCalledTimes(1);
    });

    it('should call ContactsRepo.updateOneById()', async () => {
      await service.modifyContact(user, 1, data);

      expect(contactsRepo.updateOneById).toHaveBeenCalled();
      expect(contactsRepo.updateOneById).toHaveBeenCalledTimes(1);
    });

    it('should return returns the updated contact', async () => {
      const result = await service.modifyContact(user, 1, data);

      expect(result).toBe(contact);
    });
  });

  describe('validate()', () => {
    const user = { id: 1 } as User;
    const contact = { userId: 1 } as Contact;

    it('should throws NotFoundException with error message "Contact Not Found" whene contact is undefined', async () => {
      const fn = service.validate.bind(service, user, null);

      expect(fn).toThrow(NotFoundException);
      expect(fn).toThrow('Contact Not Found');
    });

    it('should throw ForbiddenException with error message "Not Allowed" when the user is not owned the number', async () => {
      const fn = service.validate.bind(service, user, { userId: 2 });

      expect(fn).toThrow(ForbiddenException);
      expect(fn).toThrow('Not Allowed');
    });

    it('should pass all validation', async () => {
      const fn = service.validate.bind(service, user, contact);

      expect(fn).not.toThrow();
    });
  });
});
