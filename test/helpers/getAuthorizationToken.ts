import { TestCore } from '#test/config/test-core';
import { AuthService } from '#app-root/auth/auth.service';
import { IUser } from '#app-root/users/interfaces/user.interface';

export const getAuthorizationToken = async (
  testCore: TestCore,
  user: IUser,
): Promise<string> => {
  const auth = testCore.app.get(AuthService);

  return auth.createJwtPlayload(user);
};
