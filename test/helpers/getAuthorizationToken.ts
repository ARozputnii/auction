import * as bcrypt from 'bcrypt';
import { userMock } from '#test/mocks/entities/user.mock';
import { TestCore } from '#test/config/test-core';

const userMockData = userMock();

export const getAuthorizationToken = async (
  testCore: TestCore,
  userData = userMockData,
): Promise<string> => {
  const request = testCore.httpRequest;
  const dbConnection = testCore.dbConnection;

  const hashedPassword = await bcrypt.hash(userData.password.toString(), 10);

  await dbConnection.collection('users').insertOne({
    ...userData,
    password: hashedPassword,
  });

  const userParams: object = {
    email: userData.email,
    password: userData.password,
  };

  const response = await request.post('/api/auth/sign_in').send(userParams);

  return response.body.token;
};
