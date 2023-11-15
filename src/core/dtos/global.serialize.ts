import { Exclude, Expose } from 'class-transformer';

export class GlobalSerialize {
  @Expose()
  message: string;

  @Exclude()
  password: string;
}
