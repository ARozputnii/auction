import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Bid } from '#app-root/bids/schemas/bid.schema';
import { Lot } from '#app-root/lots/schemas/lot.schema';
import { User } from '#app-root/users/schemas/user.schema';

export type OrderDocument = Order & Document;

export enum ArrivalType {
  'Royal Mail',
  'United States Postal Service',
  'DHL Express',
}

export enum Status {
  pending,
  sent,
  delivered,
}

@Schema({ timestamps: true })
export class Order {
  @Prop({
    default: mongoose.Types.ObjectId,
  })
  _id: string;

  @Prop()
  arrivalLocation: string;

  @Prop({
    type: String,
    enum: ArrivalType,
    message: '{VALUE} is not supported',
  })
  arrivalType: ArrivalType;

  @Prop({
    type: String,
    enum: Status,
    default: Status.pending,
    message: '{VALUE} is not supported',
  })
  status: Status;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lot',
  })
  lotId: Lot;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bid',
  })
  bidId: Bid;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  userId: User;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.post('save', async function (doc, next) {
  await this.db.models.Lot.findOneAndUpdate(
    { _id: doc.lotId },
    { orderId: doc._id },
  );

  await this.db.models.Bid.findOneAndUpdate(
    { _id: doc.bidId },
    { orderId: doc._id },
  );

  await this.db.models.User.findOneAndUpdate(
    { _id: doc.userId },
    { orderId: doc._id },
  );

  next();
});
