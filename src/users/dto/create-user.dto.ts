import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(4, { message: 'Username is too short, minimal length is 4' })
  @MaxLength(16, { message: 'Username is too long, maximum length is 16' })
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @MinLength(4, { message: 'Password is too short, minimal length is 4' })
  @MaxLength(32, { message: 'Password is too long, maximum length is 16' })
  @IsNotEmpty()
  password: string;
}
