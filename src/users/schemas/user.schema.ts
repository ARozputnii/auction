import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
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
  first_name: string;

  @Prop()
  last_name: string;

  @Prop()
  phone: string;

  @Prop()
  birth_day: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
