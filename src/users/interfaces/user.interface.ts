import { Document } from 'mongoose';

export interface IUser extends Document {
  readonly email: string;
  readonly password: string;
  readonly passwordConfirmation: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly phone: string;
  readonly birthDay: string;
  readonly isRememberMe: boolean;
}
