import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop()
  proposedPrice: number;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
