import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bid, BidDocument } from '#app-root/bids/schemas/bid.schema';
import { CreateBidDto } from '#app-root/bids/dto/create-bid.dto';
import { User, UserDocument } from '#app-root/users/schemas/user.schema';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private readonly bidModel: Model<BidDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createLotDto: CreateBidDto): Promise<Bid> {
    return await this.bidModel.create(createLotDto);
  }

  async findAll(lotId: string): Promise<Bid[]> {
    const bids = await this.userModel
      .find({})
      .populate('userBids')
      .populate('userLots')
      .exec();
    console.log(JSON.stringify(bids));
    return bids as any
    // return await this.bidModel.find({ lotId }).exec();
  }
}
