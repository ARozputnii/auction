import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { SkipAuth } from './skip-auth.decorator';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('sign_in')
  async login(@Request() req) {
    const token = this.authService.login(req.user);

    if (token) {
      const is_remember_me = req.body.remember_me;
      await this.usersService.update(req.user._id, { is_remember_me });
    }

    return token;
  }

  @SkipAuth()
  @Post('sign_up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @SkipAuth()
  @Post('/forgot_password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('/reset_password')
  async resetPassword(
    @Request() req,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return await this.authService.resetPassword(
      req.user.email,
      resetPasswordDto,
    );
  }
}
