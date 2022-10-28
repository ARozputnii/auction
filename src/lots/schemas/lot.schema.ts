import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '#app-root/users/schemas/user.schema';
import { Bid } from '#app-root/bids/schemas/bid.schema';

export type LotDocument = Lot & Document;

export enum Status {
  pendind,
  inProcess,
  closed,
}

@Schema({ timestamps: true })
export class Lot {
  @Prop({
    default: mongoose.Types.ObjectId,
  })
  _id: string;

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
  currentPrice: number;

  @Prop({
    required: true,
    min: 0,
  })
  estimatedPrice: number;

  @Prop({
    required: true,
  })
  lotStartTime: Date;

  @Prop({
    required: true,
  })
  lotEndTime: Date;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }] })
  bids: Bid[];
}

export const LotSchema = SchemaFactory.createForClass(Lot);

LotSchema.post('save', async function (doc, next) {
  const user = await this.db.models.User.findById(doc.userId);
  if (user) {
    user.lots.push(doc._id);
    await user.save();
  }

  next();
});
