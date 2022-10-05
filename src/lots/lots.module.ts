import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from './schemas/lot.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Lot.name, schema: LotSchema }])],
})
export class LotsModule {}
