import { IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  newPassword: string;

  @ApiProperty()
  @MinLength(6, { message: 'Password must be 6 characters or more.' })
  newPasswordConfirmation: string;
}
