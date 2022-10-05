import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { BidsModule } from './bids/bids.module';
import { LotsModule } from './lots/lots.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` }),
    MongooseModule.forRoot(process.env.DB_URL),
    UsersModule,
    BidsModule,
    LotsModule,
    OrdersModule,
  ],
})
export class AppModule {}
