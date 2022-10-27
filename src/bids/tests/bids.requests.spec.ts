import { Connection } from 'mongoose';
import { getAuthorizationToken } from '#test/helpers/getAuthorizationToken';
import { TestCore } from '#test/config/test-core';
import { TestCoreBuilder } from '#test/config/test-core-builder';
import { SuperTest } from 'supertest';
import { userMock } from '#test/mocks/entities/user.mock';
import { bidMock } from '#test/mocks/entities/bid.mock';
import { lotMock } from '#test/mocks/entities/lot.mock';
import { BidsModule } from '#app-root/bids/bids.module';
import { IUser } from '#app-root/users/interfaces/user.interface';
import { setUser } from '#test/helpers/setUser';

describe('BidsController', () => {
  let testCore: TestCore;
  let dbConnection: Connection;
  let request: SuperTest<any>;
  let authorizationToken: string;
  let lotID: any;
  let user: IUser;

  const bidData = bidMock();

  beforeAll(async () => {
    testCore = await TestCoreBuilder.init(BidsModule).build();
    request = testCore.httpRequest;
    dbConnection = testCore.dbConnection;
  });

  afterAll(async () => {
    await testCore.closeApp();
  });

  beforeEach(async () => {
    user = await setUser(testCore, userMock());
    authorizationToken = await getAuthorizationToken(testCore, user);
    const lotData = lotMock(user._id);
    const lot = await dbConnection.collection('lots').insertOne(lotData);
    lotID = lot.insertedId;
  });

  afterEach(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('lots').deleteMany({});
    await dbConnection.collection('bids').deleteMany({});
  });

  describe('create', () => {
    describe('when success', () => {
      it('should be create bid', async () => {
        const response = await request
          .post(`/api/bids/${lotID}`)
          .send(bidData)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(201);
        expect(response.body.proposedPrice).toBe(+bidData.proposedPrice);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request
            .post(`/api/bids/${lotID}`)
            .send(bidData);

          expect(response.status).toBe(401);
        });
      });

      describe('when lot not found', () => {
        it('should be status 404', async () => {
          const response = await request
            .post('/api/bids/NotFoundLotID')
            .send(bidData)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
        });
      });

      describe('when proposedPrice not present', () => {
        it('should be status 400', async () => {
          bidData.proposedPrice = '';

          const response = await request
            .post(`/api/bids/${lotID}`)
            .send(bidData)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(400);
          expect(response.body.message).toStrictEqual([
            'proposedPrice must not be less than 1',
          ]);
        });
      });
    });
  });

  describe('findAll', () => {
    describe('when success', () => {
      beforeEach(async () => {
        const bids = [bidMock(lotID, user._id), bidMock(lotID)];
        await dbConnection.collection('bids').insertMany(bids);
      });

      it('should be return all lots', async () => {
        const response = await request
          .get(`/api/bids/${lotID}`)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request.get(`/api/bids/${lotID}`);

          expect(response.status).toBe(401);
        });
      });

      describe('when Not Found', () => {
        it('should be status 404', async () => {
          const response = await request
            .get(`/api/bids/incorrectLotId`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
        });
      });
    });
  });
});
