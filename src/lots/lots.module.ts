import { Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from './schemas/lot.schema';

@Module({
  controllers: [LotsController],
  providers: [LotsService],
  imports: [MongooseModule.forFeature([{ name: Lot.name, schema: LotSchema }])],
})
export class LotsModule {}
