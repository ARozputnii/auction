import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OrderDocument = Order & Document;

enum arrivalType {
  'Royal Mail',
  'United States Postal Service',
  'DHL Express',
}

enum Status {
  pendind,
  sent,
  delivered,
}

@Schema({ timestamps: true })
export class Order {
  @Prop()
  arrivalLocation: string;

  @Prop({
    type: String,
    enum: arrivalType,
    message: '{VALUE} is not supported',
  })
  arrivalType: arrivalType;

  @Prop({
    type: String,
    enum: Status,
    message: '{VALUE} is not supported',
  })
  status: Status;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
