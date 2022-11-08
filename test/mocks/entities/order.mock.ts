import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '#test/helpers/getRandomEnumValue';
import { ArrivalType } from '#app-root/orders/schemas/order.schema';

export const orderMock: any = (lotId: string, bidId: string) => {
  return {
    arrivalLocation: faker.address.streetAddress(),
    arrivalType: getRandomEnumValue(ArrivalType),
    bidId: bidId,
    lotId: lotId,
  };
};
