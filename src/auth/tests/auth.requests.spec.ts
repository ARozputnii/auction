import { Connection } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { userMock } from '#test/mocks/entities/user.mock';
import { MailService } from '#app-root/mail/mail.service';
import { TestCoreBuilder } from '#test/config/test-core-builder';
import { AuthModule } from '#app-root/auth/auth.module';
import { TestCore } from '#test/config/test-core';
import { getAuthorizationToken } from '#test/helpers/getAuthorizationToken';

describe('AuthController', () => {
  let testCore: TestCore;
  let dbConnection: Connection;
  let request: any;

  const userData = userMock();

  beforeAll(async () => {
    testCore = await TestCoreBuilder.init(AuthModule).build();

    request = testCore.httpRequest;
    dbConnection = testCore.dbConnection;
  });

  afterAll(async () => {
    await testCore.closeApp();
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

        const response = await request
          .post('/api/auth/sign_in')
          .send(userParams);

        expect(response.status).toBe(201);
        expect(response.body.hasOwnProperty('token')).toBe(true);
      });
    });

    describe('when errors', () => {
      describe('when password is incorrect', () => {
        beforeEach(async () => {
          await request.post('/api/auth/sign_up').send(userData);
        });

        it('should create a user', async () => {
          const userParams: object = {
            email: userData.email,
            password: 'wrong_pass',
          };

          const response = await request
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
        const response = await request.post('/api/auth/sign_up').send(userData);

        expect(response.status).toBe(201);
        expect(response.body.email).toBe(userData.email);

        const user = await dbConnection
          .collection('users')
          .findOne({ email: userData.email });
        expect(user.email).toBe(userData.email);
      });
    });

    describe('when errors', () => {
      describe('when user with that email already exists', () => {
        it('should error', async () => {
          await dbConnection.collection('users').insertOne(userData);

          const response = await request
            .post('/api/auth/sign_up')
            .send(userData);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe(
            'User with that email already exists',
          );
        });
      });

      describe('when param password is empty', () => {
        it('should error', async () => {
          const userParams: object = { email: userData.email };
          const response = await request
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
      await request.post('/api/auth/sign_up').send(userData);
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
        const response = await request
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

          const response = await request
            .post('/api/auth/forgot_password')
            .send(params);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Invalid email');
        });
      });
    });
  });

  describe('resetPassword', () => {
    const newPassword = '111111';
    const params: object = {
      newPassword,
      newPasswordConfirmation: newPassword,
    };

    describe('when success', () => {
      it('must change the password', async () => {
        const authorizationToken = await getAuthorizationToken(
          testCore,
          userData,
        );

        const response = await request
          .patch('/api/auth/reset_password')
          .set('Authorization', `Bearer ${authorizationToken}`)
          .send(params);

        expect(response.status).toBe(200);
        expect(response.body.email).toBe(userData.email);
      });
    });

    describe('when errors', () => {
      describe('when passwords do not match', () => {
        it('should return an error', async () => {
          const authorizationToken = await getAuthorizationToken(
            testCore,
            userData,
          );

          const params: object = {
            newPassword,
            newPasswordConfirmation: 'incorrect',
          };

          const response = await request
            .patch('/api/auth/reset_password')
            .set('Authorization', `Bearer ${authorizationToken}`)
            .send(params);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe('Passwords do not match');
        });
      });

      describe('when 401 Unauthorized', () => {
        it('should return an error', async () => {
          const response = await request
            .patch('/api/auth/reset_password')
            .send(params);

          expect(response.status).toBe(401);
        });
      });
    });
  });
});
