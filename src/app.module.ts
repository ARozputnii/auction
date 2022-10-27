import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '#app-root/database/database.module';
import { UsersModule } from '#app-root/users/users.module';
import { BidsModule } from '#app-root/bids/bids.module';
import { LotsModule } from '#app-root/lots/lots.module';
import { OrdersModule } from '#app-root/orders/orders.module';
import { AuthModule } from '#app-root/auth/auth.module';
import { MailModule } from '#app-root/mail/mail.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from '#app-root/auth/jwt-auth.guard';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? `.env`
          : `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    BidsModule,
    LotsModule,
    OrdersModule,
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
export class AppModule {}
