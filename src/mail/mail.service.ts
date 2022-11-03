import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from '#app-root/users/schemas/user.schema';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendResetPasswordToken(user: User, token: string) {
    const url = `${process.env.DOMAIN}/auth/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset password',
      template: './reset-password',
      context: {
        name: user.firstName || user.email,
        url,
      },
    });
  }

  async sendCongratulationsToLotWinner(user: User, lotTitle: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Congratulate the winner of the lot',
      template: './lot-winner',
      context: {
        name: user.firstName || user.email,
        title: lotTitle,
      },
    });
  }
}
