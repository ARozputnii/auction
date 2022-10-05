import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop()
  proposed_price: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
