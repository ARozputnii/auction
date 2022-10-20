import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinDate,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  @MaxLength(100)
  password: string;

  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  @MaxLength(100)
  passwordConfirmation: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date(new Date().getFullYear() - 21, 1))
  birthDay: Date;
}
