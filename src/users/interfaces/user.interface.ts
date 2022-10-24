export interface IUser {
  readonly id?: string;
  readonly _id?: string;
  readonly email: string;
  readonly password: string;
  readonly passwordConfirmation?: string;
  readonly lastName: string;
  readonly firstName: string;
  readonly phone: string;
  readonly birthDay: Date;
  readonly isRememberMe: boolean;
}
