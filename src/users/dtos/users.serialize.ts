import { Expose } from 'class-transformer';
import { Roles } from '../../auth/roles/roles.enum';
import { User } from '../../database/database.service';

export class UsersSerialize implements Omit<User, 'password'> {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  dateOfBarth: Date;

  @Expose()
  role: Roles;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
