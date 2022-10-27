import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Lot } from '#app-root/lots/schemas/lot.schema';
import { Bid } from '#app-root/bids/schemas/bid.schema';

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
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('userBids', {
  ref: 'Bid',
  localField: '_id',
  foreignField: 'userId',
});

UserSchema.virtual('userLots', {
  ref: 'Lot',
  localField: '_id',
  foreignField: 'userId',
});
