import { IUser } from '#app-root/users/interfaces/user.interface';

export interface FilterInterface {
  readonly own: boolean;
  readonly user: IUser;
}
