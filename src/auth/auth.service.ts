import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '#app-root/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '#app-root/mail/mail.service';
import { ForgotPasswordDto } from '#app-root/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '#app-root/auth/dto/reset-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(password, user.password);
      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(user: any) {
    const token = this.createJwtPlayload(user);

    return { token };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);

    if (!user) {
      throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
    }

    const token = this.createJwtPlayload(user);

    this.mailService.sendResetPasswordToken(user, token);

    return {
      message: 'The instruction was successfully sent to the user mail',
    };
  }

  async resetPassword(email: string, resetPasswordDto: ResetPasswordDto) {
    if (
      resetPasswordDto.newPassword !== resetPasswordDto.newPasswordConfirmation
    ) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
    const user = await this.usersService.findByEmail(email);
    const password = await this.usersService.bcryptPassword(
      resetPasswordDto.newPassword,
    );
    await this.usersService.update(user._id, { password });

    return user;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private createJwtPlayload({ _id, email }): string {
    const payload = { email: email, id: _id };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_TOKEN_SECRET,
      expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME,
    });
  }
}
