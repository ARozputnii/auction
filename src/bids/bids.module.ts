import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from '#app-root/bids/schemas/bid.schema';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Bid.name, schema: BidSchema }])],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
