import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Lot } from '#app-root/lots/schemas/lot.schema';
import { Bid } from '#app-root/bids/schemas/bid.schema';
import { Order } from '#app-root/orders/schemas/order.schema';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    },
  },
  timestamps: true,
})
export class User {
  @Prop({
    default: mongoose.Types.ObjectId,
  })
  _id: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  phone: string;

  @Prop()
  birthDay: Date;

  @Prop({ default: false })
  isRememberMe: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lot' }] })
  lots: Lot[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bid' }] })
  bids: Bid[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  })
  orderId: Order;
}

export const UserSchema = SchemaFactory.createForClass(User);
