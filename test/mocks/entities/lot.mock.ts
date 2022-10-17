import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from '../../config/getRandomEnumValue';
import { Status } from '../../../src/lots/schemas/lot.schema';

export const lotMock: any = () => {
  return {
    title: faker.lorem.sentence(),
    image: faker.image.imageUrl(),
    status: getRandomEnumValue(Status),
    currentPrice: faker.random.numeric(3, { allowLeadingZeros: false }),
    estimatedPrice: faker.random.numeric(3, { allowLeadingZeros: false }),
    lotStartTime: Date.now(),
    lotEndTime: Date.now(),
  };
};
