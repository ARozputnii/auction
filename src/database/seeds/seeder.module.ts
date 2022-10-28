import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '#app-root/database/database.module';
import { SeederService } from '#app-root/database/seeds/seeder.service';
import { UsersModule } from '#app-root/users/users.module';
import { LotsModule } from '#app-root/lots/lots.module';
import { BidsModule } from '#app-root/bids/bids.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env.dev',
      isGlobal: true,
    }),
    DatabaseModule,
    UsersModule,
    LotsModule,
    BidsModule,
  ],
  providers: [SeederService],
})
export class SeederModule {}
