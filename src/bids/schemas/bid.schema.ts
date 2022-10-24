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

BidSchema.post('save', async function (doc, next) {
  const lot = await this.db.models.Lot.findById(doc.lotId);
  if (lot) {
    lot.bids.push(doc._id);
    lot.save();
  }

  const user = await this.db.models.User.findById(doc.userId);
  if (user) {
    user.bids.push(doc._id);
    user.save();
  }

  next();
});
