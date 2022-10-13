import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '../mail/mail.service';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
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

    return { access_token: token };
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
      resetPasswordDto.new_password ===
      resetPasswordDto.new_password_confirmation
    ) {
      const user = await this.usersService.findByEmail(email);
      const password = await this.usersService.bcryptPassword(
        resetPasswordDto.new_password,
      );
      await this.usersService.update(user._id, { password });

      return user;
    } else {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }
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
