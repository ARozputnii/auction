import { Module } from '@nestjs/common';
import { LotsController } from '#app-root/lots/lots.controller';
import { LotsService } from '#app-root/lots/lots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from '#app-root/lots/schemas/lot.schema';
import { LotsProducerService } from '#app-root/lots/lots.producer.service';
import { LotsConsumer } from '#app-root/lots/lots.consumer';
import { BullModule } from '@nestjs/bull';

@Module({
  controllers: [LotsController],
  providers: [LotsService, LotsProducerService, LotsConsumer],
  imports: [
    MongooseModule.forFeature([{ name: Lot.name, schema: LotSchema }]),
    BullModule.registerQueue({
      name: 'lotsQueue',
    }),
  ],
  exports: [LotsProducerService],
})
export class LotsModule {}
