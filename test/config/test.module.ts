import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '#app-root/database/database.module';
import { AuthModule } from '#app-root/auth/auth.module';
import { MailModule } from '#app-root/mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '#app-root/auth/jwt-auth.guard';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.test',
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    MailModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class TestModule {}
