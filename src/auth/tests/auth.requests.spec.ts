import { Connection } from 'mongoose';
import { userMock } from '../../../test/mocks/entities/user.mock';
import getServer from '../../../test/config/getServer';
import getDbConnection from '../../../test/config/getDbConnection';
import * as bcrypt from 'bcrypt';
import * as request from 'supertest';
import { CreateUserDto } from '#app-root/users/dto/create-user.dto';
import { MailService } from '#app-root/mail/mail.service';

describe('AuthController', () => {
  let dbConnection: Connection;
  let httpServer: any;

  const userData = userMock();

  beforeAll(async () => {
    httpServer = await getServer();
    dbConnection = await getDbConnection();
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  afterEach(async () => {
    await dbConnection.collection('users').deleteMany({});
  });

  describe('login', () => {
    describe('when success', () => {
      beforeEach(async () => {
        const hashedPassword = await bcrypt.hash(
          userData.password.toString(),
          10,
        );

        await dbConnection.collection('users').insertOne({
          ...userData,
          password: hashedPassword,
        });
      });

      it('should create a user', async () => {
        const userParams: object = {
          email: userData.email,
          password: userData.password,
        };

        const response = await request(httpServer)
          .post('/api/auth/sign_in')
          .send(userParams);

        expect(response.status).toBe(201);
        expect(response.body.hasOwnProperty('token')).toBe(true);
      });
    });

    describe('when errors', () => {
      describe('when password is incorrect', () => {
        beforeEach(async () => {
          await request(httpServer).post('/api/auth/sign_up').send(userData);
        });

        it('should create a user', async () => {
          const userParams: object = {
            email: userData.email,
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
        const userParams: CreateUserDto = userData;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, birthDay, ...shortUserParams }: any = {
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
          await dbConnection.collection('users').insertOne(userData);
        });

        it('should error', async () => {
          const userParams: CreateUserDto = userData;
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
          const userParams: object = { email: userData.email };
          const response = await request(httpServer)
            .post('/api/auth/sign_up')
            .send(userParams);

          expect(response.status).toBe(400);
          expect(response.body.message).toStrictEqual([
            'password must be shorter than or equal to 100 characters',
            'Password must be 6 characters or more.',
            'passwordConfirmation must be shorter than or equal to 100 characters',
            'Password must be 6 characters or more.',
          ]);
        });
      });
    });
  });

  describe('forgotPassword', () => {
    beforeEach(async () => {
      await request(httpServer).post('/api/auth/sign_up').send(userData);
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });

    const spy = jest
      .spyOn(MailService.prototype, 'sendResetPasswordToken')
      .mockImplementation(() => {
        return true;
      });

    describe('when success', () => {
      it('should send instruction on user email', async () => {
        const params: object = { email: userData.email };
        const response = await request(httpServer)
          .post('/api/auth/forgot_password')
          .send(params);

        expect(response.status).toBe(201);
        expect(spy).toHaveBeenCalled();
        expect(response.body.message).toBe(
          'The instruction was successfully sent to the user mail',
        );
      });
    });

    describe('when errors', () => {
      describe('when invalid email', () => {
        it('should return an error', async () => {
          const params: object = { email: 'wrong_email@b.com' };

          const response = await request(httpServer)
            .post('/api/auth/forgot_password')
            .send(params);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Invalid email');
        });
      });
    });
  });

  describe('resetPassword', () => {
    beforeEach(async () => {
      await request(httpServer).post('/api/auth/sign_up').send(userData);
    });
    const password = '111111';
    const params: object = {
      newPassword: password,
      newPasswordConfirmation: password,
    };

    describe('when success', () => {
      it('must change the password', async () => {
        const signInResponse = await request(httpServer)
          .post('/api/auth/sign_in')
          .send({
            email: userData.email,
            password: userData.password,
          });

        const token = signInResponse.body.token;

        const response = await request(httpServer)
          .patch('/api/auth/reset_password')
          .set('Authorization', `Bearer ${token}`)
          .send(params);

        expect(response.status).toEqual(200);
        expect(response.body.email).toBe(userData.email);
      });
    });

    describe('when errors', () => {
      describe('when passwords do not match', () => {
        it('should return an error', async () => {
          const signInResponse = await request(httpServer)
            .post('/api/auth/sign_in')
            .send({
              email: userData.email,
              password: userData.password,
            });

          const token = signInResponse.body.token;

          const params: object = {
            newPassword: password,
            newPasswordConfirmation: 'incorrect',
          };

          const response = await request(httpServer)
            .patch('/api/auth/reset_password')
            .set('Authorization', `Bearer ${token}`)
            .send(params);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Passwords do not match');
        });
      });

      describe('when 401 Unauthorized', () => {
        it('should return an error', async () => {
          const response = await request(httpServer)
            .patch('/api/auth/reset_password')
            .send(params);

          expect(response.status).toBe(401);
        });
      });
    });
  });
});
