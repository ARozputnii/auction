import { TestCore } from '#test/config/test-core';
import { IUser } from '#app-root/users/interfaces/user.interface';
import { UsersService } from '#app-root/users/users.service';

export const setUser: any = async (
  testCore: TestCore,
  userData: any,
): Promise<IUser> => {
  const auth = testCore.app.get(UsersService);
  const dbConnection = testCore.dbConnection;

  userData.password = await auth.bcryptPassword(userData.password);
  const user = await dbConnection.collection('users').insertOne(userData);

  userData._id = user.insertedId;

  return userData;
};
