import { faker } from '@faker-js/faker';

export const bidMock: any = (lotId: string, userId?: string) => {
  return {
    proposedPrice: faker.random.numeric(3, { allowLeadingZeros: false }),
    userId: userId,
    lotId: lotId,
  };
};
