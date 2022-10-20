import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'example@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
