import { ApiProperty } from '@nestjs/swagger';

export class LocalAuthDto {
  @ApiProperty()
  usernameOrEmail: string;
  @ApiProperty()
  password: string;
}
