import { Contact, ContactType } from '../../../database/database.service';
import { ApiResponseProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ContactSerialize implements Contact {
  @ApiResponseProperty()
  @Expose()
  id: number;

  @ApiResponseProperty({ enum: ContactType })
  @Expose()
  type: ContactType;

  @ApiResponseProperty()
  @Expose()
  countryCode: string;

  @ApiResponseProperty()
  @Expose()
  number: string;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;

  @ApiResponseProperty()
  @Expose()
  userId: number;
}
