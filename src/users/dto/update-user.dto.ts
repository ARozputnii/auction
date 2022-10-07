import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  first_name: string;

  last_name: string;

  phone: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date(new Date().getFullYear() - 21, 1))
  birth_day: Date;

  @IsOptional()
  @IsBoolean()
  is_remember_me: boolean;
}
