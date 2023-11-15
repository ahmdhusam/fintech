import { Expose } from 'class-transformer';
import { Roles } from '../../auth/roles/roles.enum';
import { User } from '../../database/database.service';
import { ApiResponseProperty } from '@nestjs/swagger';

export class UsersSerialize implements Omit<User, 'password'> {
  @ApiResponseProperty()
  @Expose()
  id: number;

  @ApiResponseProperty()
  @Expose()
  name: string;

  @ApiResponseProperty()
  @Expose()
  username: string;

  @ApiResponseProperty()
  @Expose()
  email: string;

  @ApiResponseProperty()
  @Expose()
  dateOfBirth: Date;

  @ApiResponseProperty({ enum: Roles })
  @Expose()
  role: Roles;

  @ApiResponseProperty()
  @Expose()
  createdAt: Date;

  @ApiResponseProperty()
  @Expose()
  updatedAt: Date;
}
