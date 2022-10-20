import { Module } from '@nestjs/common';
import { LotsController } from '#app-root/lots/lots.controller';
import { LotsService } from '#app-root/lots/lots.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lot, LotSchema } from '#app-root/lots/schemas/lot.schema';

@Module({
  controllers: [LotsController],
  providers: [LotsService],
  imports: [MongooseModule.forFeature([{ name: Lot.name, schema: LotSchema }])],
})
export class LotsModule {}
