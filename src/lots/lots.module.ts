import { Module } from '@nestjs/common';
import { LotsController } from '#app-root/lots/lots.controller';
import { LotsService } from '#app-root/lots/lots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from '#app-root/lots/schemas/lot.schema';
import { LotsProducerService } from '#app-root/lots/lots.producer.service';
import { LotsConsumer } from '#app-root/lots/lots.consumer';
import { BullModule } from '@nestjs/bull';
import { MailService } from '#app-root/mail/mail.service';
import { User, UserSchema } from '#app-root/users/schemas/user.schema';

@Module({
  controllers: [LotsController],
  providers: [LotsService, LotsProducerService, LotsConsumer, MailService],
  imports: [
    MongooseModule.forFeature([
      { name: Lot.name, schema: LotSchema },
      { name: User.name, schema: UserSchema },
    ]),
    BullModule.registerQueue({
      name: 'lotsQueue',
    }),
  ],
  exports: [LotsService],
})
export class LotsModule {}
