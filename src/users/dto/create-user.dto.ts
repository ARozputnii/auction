import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsMinYear } from '#app-root/validations/is-min-year.validation';

export class CreateUserDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'Password' })
  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  readonly password: string;

  @ApiProperty({ example: 'Password' })
  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  readonly passwordConfirmation: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly lastName: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  readonly phone: string;

  @ApiProperty({ example: '2000-01-01' })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsMinYear(21)
  @IsDate()
  readonly birthDay: Date;
}
