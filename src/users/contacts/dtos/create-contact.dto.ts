import { IsEnum, IsNumberString, IsPhoneNumber, Length } from 'class-validator';
import { Contact, ContactType } from '../../../database/database.service';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto
  implements Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'userId'>
{
  @ApiProperty({ enum: ContactType })
  @IsEnum(ContactType)
  type: ContactType;

  @ApiProperty()
  @Length(4)
  @IsNumberString()
  countryCode: string;

  @ApiProperty()
  @IsPhoneNumber()
  number: string;
}
