import { Connection } from 'mongoose';
import { lotMock } from '#test/mocks/entities/lot.mock';
import getServer from '#test/config/getServer';
import getDbConnection from '#test/config/getDbConnection';
import { getAuthorizationToken } from '#test/config/getAuthorizationToken';
import * as request from 'supertest';

describe('LotsController', () => {
  let dbConnection: Connection;
  let httpServer: any;

  const lotData = lotMock();

  beforeAll(async () => {
    httpServer = await getServer();
    dbConnection = await getDbConnection();
  });

  afterAll(async () => {
    await dbConnection.close();
  });

  afterEach(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('lots').deleteMany({});
  });

  describe('findAll', () => {
    describe('when success', () => {
      beforeEach(async () => {
        await dbConnection.collection('lots').insertOne(lotData);
      });

      it('should be return all lots', async () => {
        const authorizationToken = await getAuthorizationToken();
        const response = await request(httpServer)
          .get('/api/lots')
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request(httpServer).get('/api/lots');

          expect(response.status).toBe(401);
        });
      });
    });
  });

  describe('create', () => {
    describe('when success', () => {
      it('should be create lot', async () => {
        const authorizationToken = await getAuthorizationToken();
        const response = await request(httpServer)
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
          const response = await request(httpServer)
            .post('/api/lots')
            .send(lotData);

          expect(response.status).toBe(401);
        });
      });

      describe('when title not present', () => {
        it('should be create lot', async () => {
          lotData.title = '';

          const authorizationToken = await getAuthorizationToken();
          const response = await request(httpServer)
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
      await dbConnection.collection('lots').insertOne(lotData);
    });

    describe('when success', () => {
      it('should be create lot', async () => {
        const authorizationToken = await getAuthorizationToken();
        const requestOnFindAll = await request(httpServer)
          .get('/api/lots')
          .set('Authorization', `Bearer ${authorizationToken}`);
        const lotID = requestOnFindAll.body[0]._id;
        const response = await request(httpServer)
          .get(`/api/lots/${lotID}`)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(lotData.title);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request(httpServer)
            .post('/api/lots')
            .send(lotData);

          expect(response.status).toBe(401);
        });
      });

      describe('when lot not found', () => {
        it('should be create lot', async () => {
          const authorizationToken = await getAuthorizationToken();
          const response = await request(httpServer)
            .get(`/api/lots/some_lot_ID`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Not found!');
        });
      });
    });
  });

  describe('update', () => {
    beforeEach(async () => {
      await dbConnection.collection('lots').insertOne(lotData);
    });

    describe('when success', () => {
      it('should be create lot', async () => {
        const authorizationToken = await getAuthorizationToken();
        const requestOnFindAll = await request(httpServer)
          .get('/api/lots')
          .set('Authorization', `Bearer ${authorizationToken}`);
        const lotID = requestOnFindAll.body[0]._id;
        const lotParams = { title: 'new title' };
        const response = await request(httpServer)
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
          const response = await request(httpServer)
            .patch(`/api/lots/some_lotID`)
            .send(lotData);

          expect(response.status).toBe(401);
        });
      });

      describe('when lot not found', () => {
        it('should be create lot', async () => {
          const authorizationToken = await getAuthorizationToken();
          const response = await request(httpServer)
            .patch(`/api/lots/some_lot_ID`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Not found!');
        });
      });

      describe('when title not present', () => {
        it('should be create lot', async () => {
          const authorizationToken = await getAuthorizationToken();
          const requestOnFindAll = await request(httpServer)
            .get('/api/lots')
            .set('Authorization', `Bearer ${authorizationToken}`);
          const lotID = requestOnFindAll.body[0]._id;
          const lotParams = { title: '' };
          const response = await request(httpServer)
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
      await dbConnection.collection('lots').insertOne(lotData);
    });

    describe('when success', () => {
      it('should be create lot', async () => {
        const authorizationToken = await getAuthorizationToken();
        const requestOnFindAll = await request(httpServer)
          .get('/api/lots')
          .set('Authorization', `Bearer ${authorizationToken}`);
        const lotID = requestOnFindAll.body[0]._id;
        const response = await request(httpServer)
          .delete(`/api/lots/${lotID}`)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(
          `Lot id=${lotID} was successfully deleted!`,
        );
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request(httpServer).delete(
            `/api/lots/some_lotID}`,
          );

          expect(response.status).toBe(401);
        });
      });

      describe('when lot not found', () => {
        it('should be create lot', async () => {
          const authorizationToken = await getAuthorizationToken();
          const response = await request(httpServer)
            .delete(`/api/lots/some_lot_ID`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Not found!');
        });
      });
    });
  });
});
