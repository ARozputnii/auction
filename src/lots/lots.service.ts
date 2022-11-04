import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lot, LotDocument } from '#app-root/lots/schemas/lot.schema';
import { Model } from 'mongoose';
import { CreateLotDto } from '#app-root/lots/dto/create-lot.dto';
import { UpdateLotDto } from '#app-root/lots/dto/update-lot.dto';
import { FilterInterface } from '#app-root/lots/interfaces/filter.interface';
import { LotsProducerService } from '#app-root/lots/lots.producer.service';
import { User, UserDocument } from '#app-root/users/schemas/user.schema';

@Injectable()
export class LotsService {
  constructor(
    @InjectModel(Lot.name) private readonly lotModel: Model<LotDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly lotProducerService: LotsProducerService,
  ) {}

  async create(createLotDto: CreateLotDto): Promise<Lot> {
    const lot = await this.lotModel.create(createLotDto);
    await this.lotProducerService.startLot(lot);

    return lot;
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
    return await this.setLot(id);
  }

  async update(id: string, updateLotDto: UpdateLotDto) {
    const lot = await this.setLot(id);

    this.checkAccessToOperation(lot);

    return await this.lotModel.findOneAndUpdate({ _id: id }, updateLotDto, {
      new: true,
    });
  }

  async remove(id: string) {
    const lot = await this.setLot(id);

    this.checkAccessToOperation(lot);

    return await lot.delete();
  }

  async finishLot(lot) {
    await this.lotModel.findOneAndUpdate(
      { _id: lot._id },
      { status: 'closed' },
    );
    const user = await this.userModel.findOne({ _id: lot.userId });
    await this.lotProducerService.finishLot(user, lot);
  }

  private async setLot(id: string) {
    const lot = await this.lotModel
      .findOne({ _id: id })
      .populate('bids')
      .exec();

    if (!lot) {
      throw new NotFoundException();
    }

    return lot;
  }

  private checkAccessToOperation(lot: Lot) {
    if (String(lot.status) !== 'pending') {
      throw new HttpException(
        'Available only for lots with pending status',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
