import { User } from '../../../src/users/schemas/user.schema';
import { faker } from '@faker-js/faker';

export const userMock: User = {
  email: faker.internet.email(),
  password: faker.internet.password(),
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  phone: faker.phone.number(),
  birth_day: new Date(),
  is_remember_me: false,
};
