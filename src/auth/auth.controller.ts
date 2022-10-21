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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SwaggerOptionsUtil } from '#app-root/utils/swagger-options.util';
import { CurrentUser } from '#app-root/auth/decorators/current-user.decorator';
import { IUser } from '#app-root/users/interfaces/user.interface';
import { SignInDto } from '#app-root/auth/dto/sign-in.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiResponse(SwaggerOptionsUtil.created('Return bearer token'))
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
  @SkipAuth()
  @UseGuards(LocalAuthGuard)
  @Post('sign_in')
  async login(@CurrentUser() currentUser: IUser) {
    return await this.authService.login(currentUser);
  }

  @SkipAuth()
  @ApiResponse(SwaggerOptionsUtil.created('Return created user'))
  @ApiBadRequestResponse()
  @ApiBody({ type: SignInDto })
  @Post('sign_up')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @SkipAuth()
  @ApiResponse(SwaggerOptionsUtil.created('Sent instruction to the user mail'))
  @ApiBadRequestResponse()
  @Post('/forgot_password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Patch('/reset_password')
  @ApiResponse(SwaggerOptionsUtil.ok('Return updated user'))
  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse(SwaggerOptionsUtil.unauthorized())
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
