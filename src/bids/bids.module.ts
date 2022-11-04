import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from '#app-root/bids/schemas/bid.schema';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { LotsModule } from '#app-root/lots/lots.module';
import { Lot, LotSchema } from '#app-root/lots/schemas/lot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Lot.name, schema: LotSchema },
    ]),
    LotsModule,
  ],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
