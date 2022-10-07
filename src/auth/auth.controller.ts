import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { SkipAuth } from './skip-auth.decorator';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

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
    req.user.is_remember_me = req.body?.remember_me;

    return this.authService.login(req.user);
  }

  @SkipAuth()
  @Post('sign_up')
  async sign_up(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}
