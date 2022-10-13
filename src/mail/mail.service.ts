import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendResetPasswordToken(user: User, token: string) {
    const url = `${process.env.DOMAIN}/auth/reset-password?token=${token}`;

    this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset password',
      template: './reset-password',
      context: {
        name: user.first_name || user.email,
        url,
      },
    });
  }
}