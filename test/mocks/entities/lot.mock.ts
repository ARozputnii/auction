import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '#test/helpers/getRandomEnumValue';
import { Status } from '#app-root/lots/schemas/lot.schema';
import { userMock } from '#test/mocks/entities/user.mock';

export const lotMock: any = (userId?: string, status?: string) => {
  return {
    title: faker.lorem.sentence(),
    image: faker.image.imageUrl(),
    status: status || getRandomEnumValue(Status),
    currentPrice: faker.random.numeric(3, { allowLeadingZeros: false }),
    estimatedPrice: faker.random.numeric(3, { allowLeadingZeros: false }),
    lotStartTime: Date.now(),
    lotEndTime: Date.now(),
    userId: userId || userMock(),
  };
};
