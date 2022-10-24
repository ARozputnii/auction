import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Lot } from '#app-root/lots/schemas/lot.schema';
import { User } from '#app-root/users/schemas/user.schema';

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({
    default: mongoose.Types.ObjectId,
  })
  _id: string;

  @Prop()
  proposedPrice: number;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lot',
  })
  lotId: Lot;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;
}

export const BidSchema = SchemaFactory.createForClass(Bid);

BidSchema.post('save', function (doc, next) {
  this.db
    .collection('lots')
    .updateOne({ _id: doc.lotId }, { $addToSet: { bids: doc._id } });

  next();
});
