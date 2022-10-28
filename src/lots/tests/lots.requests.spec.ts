import { Connection } from 'mongoose';
import { lotMock } from '#test/mocks/entities/lot.mock';
import { getAuthorizationToken } from '#test/helpers/getAuthorizationToken';
import { TestCore } from '#test/config/test-core';
import { TestCoreBuilder } from '#test/config/test-core-builder';
import { LotsModule } from '#app-root/lots/lots.module';
import { SuperTest } from 'supertest';
import { userMock } from '#test/mocks/entities/user.mock';
import { IUser } from '#app-root/users/interfaces/user.interface';
import { setUser } from '#test/helpers/setUser';
import { BidsModule } from '#app-root/bids/bids.module';

describe('LotsController', () => {
  let testCore: TestCore;
  let dbConnection: Connection;
  let request: SuperTest<any>;
  let authorizationToken: string;
  let lotData;
  let user: IUser;

  beforeAll(async () => {
    testCore = await TestCoreBuilder.init(LotsModule, BidsModule).build();
    request = testCore.httpRequest;
    dbConnection = testCore.dbConnection;
  });

  afterAll(async () => {
    await testCore.closeApp();
  });

  beforeEach(async () => {
    user = await setUser(testCore, userMock());
    lotData = lotMock(user._id);
    authorizationToken = await getAuthorizationToken(testCore, user);
  });

  afterEach(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('lots').deleteMany({});
  });

  describe('findAll', () => {
    describe('when success', () => {
      beforeEach(async () => {
        const anotherUser = await setUser(testCore, userMock());
        const lots = [
          lotMock(anotherUser._id),
          lotMock(anotherUser._id),
          lotMock(user._id),
          lotMock(user._id),
        ];
        await dbConnection.collection('lots').insertMany(lots);
      });

      it('should be return all lots', async () => {
        const response = await request
          .get('/api/lots')
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(4);
      });

      it('should be return own lots', async () => {
        const ownQuery = '?own=true';
        const response = await request
          .get(`/api/lots${ownQuery}`)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request.get('/api/lots');

          expect(response.status).toBe(401);
        });
      });
    });
  });

  describe('create', () => {
    describe('when success', () => {
      it('should be create lot', async () => {
        const response = await request
          .post('/api/lots')
          .send(lotData)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe(lotData.title);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request.post('/api/lots').send(lotData);

          expect(response.status).toBe(401);
        });
      });

      describe('when title not present', () => {
        it('should be create lot', async () => {
          lotData.title = '';

          const response = await request
            .post('/api/lots')
            .send(lotData)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(400);
          expect(response.body.message).toStrictEqual([
            'title should not be empty',
          ]);
        });
      });
    });
  });

  describe('findOne', () => {
    beforeEach(async () => {
      await dbConnection.models.Lot.create(lotData);
    });

    describe('when success', () => {
      it('should be create lot', async () => {
        const requestOnFindAll = await request
          .get('/api/lots')
          .set('Authorization', `Bearer ${authorizationToken}`);
        const lotID = requestOnFindAll.body[0]._id;
        const response = await request
          .get(`/api/lots/${lotID}`)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(lotData.title);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request.post('/api/lots').send(lotData);

          expect(response.status).toBe(401);
        });
      });

      describe('when lot not found', () => {
        it('should be create lot', async () => {
          const response = await request
            .get(`/api/lots/some_lot_ID`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Not Found');
        });
      });
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await dbConnection.models.Lot.create(lotData);
    });

    describe('when success', () => {
      it('should be create lot', async () => {
        const requestOnFindAll = await request
          .get('/api/lots')
          .set('Authorization', `Bearer ${authorizationToken}`);
        const lotID = requestOnFindAll.body[0]._id;
        const lotParams = { title: 'new title' };
        const response = await request
          .patch(`/api/lots/${lotID}`)
          .send(lotParams)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(lotParams.title);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request
            .patch(`/api/lots/some_lotID`)
            .send(lotData);

          expect(response.status).toBe(401);
        });
      });

      describe('when lot not found', () => {
        it('should be create lot', async () => {
          const response = await request
            .patch(`/api/lots/some_lot_ID`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Not Found');
        });
      });

      describe('when title not present', () => {
        it('should be create lot', async () => {
          const requestOnFindAll = await request
            .get('/api/lots')
            .set('Authorization', `Bearer ${authorizationToken}`);
          const lotID = requestOnFindAll.body[0]._id;
          const lotParams = { title: '' };
          const response = await request
            .patch(`/api/lots/${lotID}`)
            .send(lotParams)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(400);
          expect(response.body.message).toStrictEqual([
            'title should not be empty',
          ]);
        });
      });
    });
  });

  describe('remove', () => {
    beforeEach(async () => {
      await dbConnection.models.Lot.create(lotData);
    });

    describe('when success', () => {
      it('should be create lot', async () => {
        const requestOnFindAll = await request
          .get('/api/lots')
          .set('Authorization', `Bearer ${authorizationToken}`);
        const lotID = requestOnFindAll.body[0]._id;
        const response = await request
          .delete(`/api/lots/${lotID}`)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(204);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request.delete(`/api/lots/some_lotID}`);

          expect(response.status).toBe(401);
        });
      });

      describe('when lot not found', () => {
        it('should be create lot', async () => {
          const response = await request
            .delete(`/api/lots/some_lot_ID`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Not Found');
        });
      });
    });
  });
});
