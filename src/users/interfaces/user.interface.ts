import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly email: string;
  readonly password: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly phone: string;
  readonly birth_day: string;
  readonly is_remember_me: boolean;
}
