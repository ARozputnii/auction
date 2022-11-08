import { Connection } from 'mongoose';
import { getAuthorizationToken } from '#test/helpers/getAuthorizationToken';
import { TestCore } from '#test/config/test-core';
import { TestCoreBuilder } from '#test/config/test-core-builder';
import { SuperTest } from 'supertest';
import { userMock } from '#test/mocks/entities/user.mock';
import { bidMock } from '#test/mocks/entities/bid.mock';
import { lotMock } from '#test/mocks/entities/lot.mock';
import { BidsModule } from '#app-root/bids/bids.module';
import { setUser } from '#test/helpers/setUser';
import { LotsModule } from '#app-root/lots/lots.module';
import { OrdersModule } from '#app-root/orders/orders.module';
import { orderMock } from '#test/mocks/entities/order.mock';
import { faker } from '@faker-js/faker';
import { Status } from '#app-root/orders/schemas/order.schema';

describe('OrdersController', () => {
  let testCore: TestCore;
  let dbConnection: Connection;
  let request: SuperTest<any>;
  let authorizationToken: string;
  let lotId: string;
  let bidId: string;
  let orderData: any;

  beforeAll(async () => {
    testCore = await TestCoreBuilder.init(
      OrdersModule,
      BidsModule,
      LotsModule,
    ).build();
    request = testCore.httpRequest;
    dbConnection = testCore.dbConnection;
  });

  afterAll(async () => {
    await testCore.closeApp();
  });

  beforeEach(async () => {
    const user = await setUser(testCore, userMock());
    authorizationToken = await getAuthorizationToken(testCore, user);

    const lot = await dbConnection.models.Lot.create(lotMock(user._id));
    lotId = lot._id;
    const bid = await dbConnection.models.Bid.create(bidMock(lotId, user._id));
    bidId = bid._id;

    orderData = { userId: user._id, lotId, bidId, ...orderMock(lotId, bidId) };
  });

  afterEach(async () => {
    await dbConnection.collection('users').deleteMany({});
    await dbConnection.collection('lots').deleteMany({});
    await dbConnection.collection('bids').deleteMany({});
    await dbConnection.collection('orders').deleteMany({});
  });

  describe('create', () => {
    describe('when success', () => {
      it('should be create bid', async () => {
        const response = await request
          .post(`/api/orders/`)
          .send(orderData)
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(201);
        expect(response.body.arrivalLocation).toBe(orderData.arrivalLocation);
      });
    });

    describe('when errors', () => {
      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request.post(`/api/orders/`).send(orderData);

          expect(response.status).toBe(401);
        });
      });

      describe('when lot not found', () => {
        it('should be status 400', async () => {
          orderData.lotId = 0;
          const response = await request
            .post(`/api/orders/`)
            .send(orderData)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(400);
          expect(response.body.message).toStrictEqual([
            'lotId must be a mongodb id',
          ]);
        });
      });

      describe('when bid not found', () => {
        it('should be status 400', async () => {
          orderData.bidId = 0;
          const response = await request
            .post(`/api/orders/`)
            .send(orderData)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(400);
          expect(response.body.message).toStrictEqual([
            'bidId must be a mongodb id',
          ]);
        });
      });
    });
  });

  describe('update', () => {
    let orderId;

    beforeEach(async () => {
      const order = await dbConnection.models.Order.create(orderData);
      orderId = order._id;
    });

    describe('when success', () => {
      it('should be update lot', async () => {
        const arrivalLocation = faker.address.streetAddress();
        const response = await request
          .patch(`/api/orders/${orderId}`)
          .send({ arrivalLocation })
          .set('Authorization', `Bearer ${authorizationToken}`);

        expect(response.status).toBe(200);
        expect(response.body.arrivalLocation).toBe(arrivalLocation);
      });
    });

    describe('when errors', () => {
      describe('when status is not pending', () => {
        beforeEach(async () => {
          orderData.status = 'sent';
          const order = await dbConnection.models.Order.create(orderData);
          orderId = order._id;
        });

        it('should be status 400', async () => {
          const arrivalLocation = faker.address.streetAddress();
          const response = await request
            .patch(`/api/orders/${orderId}`)
            .send({ arrivalLocation })
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe(
            'Not available for orders with this status',
          );
        });
      });

      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request
            .patch(`/api/orders/${orderId}`)
            .send(orderData);

          expect(response.status).toBe(401);
        });
      });

      describe('when order not found', () => {
        it('should be return Not Found!', async () => {
          const response = await request
            .patch(`/api/orders/some_lot_ID`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Not Found');
        });
      });
    });
  });

  describe('switchStatus', () => {
    let orderId;

    beforeEach(async () => {
      const order = await dbConnection.models.Order.create(orderData);
      orderId = order._id;
    });

    describe('when success', () => {
      describe('when receive operation', () => {
        beforeEach(async () => {
          orderData.status = Status.sent;
          const order = await dbConnection.models.Order.create(orderData);
          orderId = order._id;
        });

        it('should be update lot', async () => {
          const response = await request
            .patch(`/api/orders/switchStatus/${orderId}?operation=receive`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(200);
          expect(response.body.status).toBe(String(Status.delivered));
        });
      });

      describe('when execute operation', () => {
        it('should be update lot', async () => {
          const response = await request
            .patch(`/api/orders/switchStatus/${orderId}?operation=execute`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(200);
          expect(response.body.status).toBe(String(Status.sent));
        });
      });
    });

    describe('when errors', () => {
      describe('when status is not pending and without operation', () => {
        beforeEach(async () => {
          orderData.status = 'sent';
          const order = await dbConnection.models.Order.create(orderData);
          orderId = order._id;
        });

        it('should be status 400', async () => {
          const arrivalLocation = faker.address.streetAddress();
          const response = await request
            .patch(`/api/orders/switchStatus/${orderId}`)
            .send({ arrivalLocation })
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(400);
          expect(response.body.message).toBe(
            'Not available for orders with this status',
          );
        });
      });

      describe('when Unauthorized', () => {
        it('should be status 401', async () => {
          const response = await request
            .patch(`/api/orders/switchStatus/${orderId}`)
            .send(orderData);

          expect(response.status).toBe(401);
        });
      });

      describe('when order not found', () => {
        it('should be return Not Found!', async () => {
          const response = await request
            .patch(`/api/orders/switchStatus/some_lot_ID`)
            .set('Authorization', `Bearer ${authorizationToken}`);

          expect(response.status).toBe(404);
          expect(response.body.message).toBe('Not Found');
        });
      });
    });
  });
});
