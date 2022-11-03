import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from '#app-root/bids/schemas/bid.schema';
import { CreateBidDto } from '#app-root/bids/dto/create-bid.dto';
import { Lot, LotDocument } from '#app-root/lots/schemas/lot.schema';
import { LotsService } from '#app-root/lots/lots.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private readonly bidModel: Model<BidDocument>,
    @InjectModel(Lot.name) private readonly lotModel: Model<LotDocument>,
    private readonly lotService: LotsService,
  ) {}

  async create(createLotDto: CreateBidDto): Promise<Bid> {
    const bid = await this.bidModel.create(createLotDto);
    const lot = await this.lotModel.findOne({ _id: createLotDto.lotId });
    if (bid.proposedPrice >= lot.estimatedPrice) {
      await this.lotService.finishLot(lot);
    }
    return bid;
  }

  async findAll(lotId: string): Promise<Bid[]> {
    return await this.bidModel.find({ lotId }).exec();
  }
}
