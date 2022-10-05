import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LotDocument = Lot & Document;

enum Status {
  pendind,
  inProcess,
  closed,
}

@Schema({ timestamps: true })
export class Lot {
  @Prop({
    required: true,
  })
  title: string;

  @Prop()
  image: string;

  @Prop({
    type: String,
    enum: Status,
    message: '{VALUE} is not supported',
  })
  status: Status;

  @Prop({
    required: true,
    min: 0,
  })
  current_price: Date;

  @Prop({
    required: true,
    min: 0,
  })
  estimated_price: Date;

  @Prop({
    required: true,
  })
  lot_start_time: Date;

  @Prop({
    required: true,
  })
  lot_end_time: Date;
}

export const LotSchema = SchemaFactory.createForClass(Lot);
