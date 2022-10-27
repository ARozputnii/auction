import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from '#app-root/bids/schemas/bid.schema';
import { BidsController } from './bids.controller';
import { BidsService } from './bids.service';
import { User, UserSchema } from '#app-root/users/schemas/user.schema';
import { Lot, LotSchema } from '#app-root/lots/schemas/lot.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Bid.name, schema: BidSchema },
      { name: Lot.name, schema: LotSchema },
    ]),
  ],
  controllers: [BidsController],
  providers: [BidsService],
})
export class BidsModule {}
