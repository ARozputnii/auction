import {
  IsBoolean,
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsMinYear } from '../../validations/is-min-year.validation';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  password: string;

  @IsOptional()
  @MinLength(6, { message: 'Password must be 6 characters or more.' })
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

  @ApiProperty({ example: '2000-01-01' })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsMinYear(21)
  birthDay: Date;

  @IsOptional()
  @IsBoolean()
  isRememberMe: boolean;
}
