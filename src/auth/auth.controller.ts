import {
  Body,
  Controller,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '#app-root/auth/auth.service';
import { UsersService } from '#app-root/users/users.service';
import { SkipAuth } from '#app-root/auth/skip-auth.decorator';
import { LocalAuthGuard } from '#app-root/auth/local-auth.guard';
import { CreateUserDto } from '#app-root/users/dto/create-user.dto';
import { ForgotPasswordDto } from '#app-root/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '#app-root/auth/dto/reset-password.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('sign_in')
  async login(@Request() req) {
    const token = this.authService.login(req.user);

    if (token) {
      const isRememberMe = req.body.isRememberMe;
      await this.usersService.update(req.user._id, { isRememberMe });
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
