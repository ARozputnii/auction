import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.${process.env.NODE_ENV}` },),
    MongooseModule.forRoot(process.env.DB_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
