import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { User } from '../../database/database.service';
import { ApiProperty } from '@nestjs/swagger';
import { Transformer } from '../../utils/transformer';

export class CreateUserDto
  implements Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>
{
  @ApiProperty({ minLength: 4, maxLength: 49 })
  @Length(4, 49)
  @Transformer.Trim()
  @IsString()
  name: string;

  @ApiProperty({ minLength: 4, maxLength: 49, uniqueItems: true })
  @Transformer.ToLowerCase()
  @Length(4, 49)
  @Transformer.Trim()
  @IsString()
  username: string;

  @ApiProperty({ minLength: 4, maxLength: 49, uniqueItems: true })
  @Transformer.ToLowerCase()
  @Length(4, 49)
  @IsEmail()
  @Transformer.Trim()
  @IsString()
  email: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  dateOfBirth: Date;

  @ApiProperty({ minLength: 8, maxLength: 60 })
  @Length(8, 60)
  @Transformer.Trim()
  @IsString()
  password: string;
}
