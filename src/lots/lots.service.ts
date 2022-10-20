import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lot, LotDocument } from '#app-root/lots/schemas/lot.schema';
import mongoose, { Model } from 'mongoose';
import { CreateLotDto } from '#app-root/lots/dto/create-lot.dto';
import { UpdateLotDto } from '#app-root/lots/dto/update-lot.dto';

@Injectable()
export class LotsService {
  constructor(
    @InjectModel(Lot.name) private readonly lotModel: Model<LotDocument>,
  ) {}

  async create(createLotDto: CreateLotDto): Promise<Lot> {
    const lot = new this.lotModel(createLotDto);
    return lot.save();
  }

  async findAll(): Promise<Lot[]> {
    return await this.lotModel.find().exec();
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.notFoundException();
    }
    return await this.lotModel.findById(id).exec();
  }

  async update(id: string, updateLotDto: UpdateLotDto) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.notFoundException();
    }
    return await this.lotModel.findOneAndUpdate({ _id: id }, updateLotDto, {
      new: true,
    });
  }

  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      this.notFoundException();
    }
    const result = await this.lotModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount) {
      return { message: `Lot id=${id} was successfully deleted!` };
    } else {
      this.notFoundException();
    }
  }

  private notFoundException() {
    throw new HttpException('Not found!', HttpStatus.NOT_FOUND);
  }
}
