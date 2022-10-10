import { Connection } from 'mongoose';
import * as request from 'supertest';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { userMock } from '../../../test/mocks/entities/user.mock';
import getServer from '../../../test/config/getServer';
import getDbConnection from '../../../test/config/getDbConnection';

describe('AuthController', () => {
  let dbConnection: Connection;
  let httpServer: any;

  beforeAll(async () => {
    httpServer = await getServer();
    dbConnection = await getDbConnection();
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  describe('login', () => {
    describe('when success', () => {
      beforeEach(async () => {
        await request(httpServer).post('/api/auth/sign_up').send(userMock);
      });

      it('should create a user', async () => {
        const userParams: object = {
          email: userMock.email,
          password: userMock.password,
        };

        const response = await request(httpServer)
          .post('/api/auth/sign_in')
          .send(userParams);

        expect(response.status).toBe(201);
        expect(response.body.hasOwnProperty('access_token')).toBe(true);
      });
    });

    describe('when errors', () => {
      describe('when password is incorrect', () => {
        beforeEach(async () => {
          await request(httpServer).post('/api/auth/sign_up').send(userMock);
        });

        it('should create a user', async () => {
          const userParams: object = {
            email: userMock.email,
            password: 'wrong_pass',
          };

          const response = await request(httpServer)
            .post('/api/auth/sign_in')
            .send(userParams);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Wrong credentials provided');
        });
      });
    });
  });

  describe('signUp', () => {
    describe('when success', () => {
      it('should create a user', async () => {
        const userParams: CreateUserDto = userMock;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _password, _birth_day, ...shortUserParams }: any = {
          ...userParams,
        };

        const response = await request(httpServer)
          .post('/api/auth/sign_up')
          .send(userParams);

        expect(response.status).toBe(201);
        // expect(response.body).toMatchObject(shortUserParams);
        expect(response.body.email).toBe(shortUserParams.email);

        const user = await dbConnection
          .collection('users')
          .findOne({ email: userParams.email });
        // expect(user).toMatchObject(shortUserParams);
        expect(user.email).toBe(shortUserParams.email);
      });
    });

    describe('when errors', () => {
      describe('when user with that email already exists', () => {
        beforeEach(async () => {
          await dbConnection.collection('users').insertOne(userMock);
        });

        it('should error', async () => {
          const userParams: CreateUserDto = userMock;
          const response = await request(httpServer)
            .post('/api/auth/sign_up')
            .send(userParams);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe(
            'User with that email already exists',
          );
        });
      });

      describe('when param password is empty', () => {
        it('should error', async () => {
          const userParams: object = { email: userMock.email };
          const response = await request(httpServer)
            .post('/api/auth/sign_up')
            .send(userParams);

          expect(response.status).toBe(400);
          expect(response.body.message).toStrictEqual([
            'password should not be empty',
          ]);
        });
      });
    });
  });
});
