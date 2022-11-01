import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Lot, LotDocument } from '#app-root/lots/schemas/lot.schema';
import { Model } from 'mongoose';
import { Logger } from '@nestjs/common';

@Processor('lotsQueue')
export class LotsConsumer {
  constructor(
    @InjectModel(Lot.name) private readonly lotModel: Model<LotDocument>,
  ) {}

  private readonly logger = new Logger('Lot jobs');

  @Process('startLotJob')
  async readOperationJob(job: Job<any>) {
    const status = 'inProcess';
    const lot = job.data.lot;
    const result = await this.lotModel.findOneAndUpdate(
      { _id: lot._id },
      { status },
    );

    this.logger.log(
      `Lot id=${result._id}. Lot.status was successfully updated on '${status}'`,
    );
  }
}
