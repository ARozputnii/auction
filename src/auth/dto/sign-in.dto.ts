import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({ example: 'example@mail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ default: 'Password' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  isRememberMe: boolean;
}
