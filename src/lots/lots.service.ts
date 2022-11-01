import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lot, LotDocument } from '#app-root/lots/schemas/lot.schema';
import { Model } from 'mongoose';
import { CreateLotDto } from '#app-root/lots/dto/create-lot.dto';
import { UpdateLotDto } from '#app-root/lots/dto/update-lot.dto';
import { FilterInterface } from '#app-root/lots/interfaces/filter.interface';

@Injectable()
export class LotsService {
  constructor(
    @InjectModel(Lot.name) private readonly lotModel: Model<LotDocument>,
  ) {}

  async create(createLotDto: CreateLotDto): Promise<Lot> {
    return await this.lotModel.create(createLotDto);
  }

  async findAll(filters: FilterInterface): Promise<Lot[]> {
    let lots;

    if (filters.own) {
      const userID = filters.user.id;
      lots = await this.lotModel
        .find({ userId: userID })
        .populate('bids')
        .exec();
    } else {
      lots = await this.lotModel
        .find({ status: 'inProcess' })
        .populate('bids')
        .exec();
    }

    return lots;
  }

  async findOne(id: string) {
    const lot = await this.lotModel.findOne({_id: id}).populate('bids').exec();

    if (!lot) {
      throw new NotFoundException();
    }
    return lot;
  }

  async update(id: string, updateLotDto: UpdateLotDto) {
    return await this.lotModel.findOneAndUpdate({ _id: id }, updateLotDto, {
      new: true,
    });
  }

  async remove(id: string) {
    const result = await this.lotModel.deleteOne({ _id: id }).exec();

    if (!result.deletedCount) {
      throw new NotFoundException();
    }
  }
}
