import { MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  @MaxLength(100)
  new_password: string;

  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  @MaxLength(100)
  new_password_confirmation: string;
}