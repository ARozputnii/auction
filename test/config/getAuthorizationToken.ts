import { userMock } from '#test/mocks/entities/user.mock';
import getServer from '#test/config/getServer';
import getDbConnection from '#test/config/getDbConnection';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';

const userMockData = userMock();

export const getAuthorizationToken = async (
  userData = userMockData,
): Promise<string> => {
  const httpServer = await getServer();
  const dbConnection = await getDbConnection();

  const hashedPassword = await bcrypt.hash(userData.password.toString(), 10);

  await dbConnection.collection('users').insertOne({
    ...userData,
    password: hashedPassword,
  });

  const userParams: object = {
    email: userData.email,
    password: userData.password,
  };

  const response = await request(httpServer)
    .post('/api/auth/sign_in')
    .send(userParams);

  return response.body.token;
};
