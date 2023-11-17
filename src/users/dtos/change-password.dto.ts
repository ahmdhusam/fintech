import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Transformer } from '../../utils/transformer';
import { IsString, Length } from 'class-validator';

export class ChangePasswordDto extends PickType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty({ minLength: 8, maxLength: 60 })
  @Length(8, 60)
  @Transformer.Trim()
  @IsString()
  newPassword: string;
}
