import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { Lot } from '#app-root/lots/schemas/lot.schema';

@Injectable()
export class LotsProducerService {
  constructor(@InjectQueue('lotsQueue') private queue: Queue) {}

  async startLot(lot: Lot) {
    const currentTime = Date.now();
    const lotStartTime = lot.lotStartTime.getTime();
    const delay = lotStartTime - currentTime;

    await this.queue.add('startLotJob', { lot }, { delay });
  }
}
