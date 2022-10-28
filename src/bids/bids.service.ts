import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from '#app-root/bids/schemas/bid.schema';
import { CreateBidDto } from '#app-root/bids/dto/create-bid.dto';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private readonly bidModel: Model<BidDocument>,
  ) {}

  async create(createLotDto: CreateBidDto): Promise<Bid> {
    return await this.bidModel.create(createLotDto);
  }

  async findAll(lotId: string): Promise<Bid[]> {
    return await this.bidModel.find({ lotId }).exec();
  }
}
