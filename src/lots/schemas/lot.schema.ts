import mongoose, { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from '#app-root/users/schemas/user.schema';

export type LotDocument = Lot & Document;

export enum Status {
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
}

export const LotSchema = SchemaFactory.createForClass(Lot);
