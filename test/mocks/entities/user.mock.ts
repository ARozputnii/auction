import { faker } from '@faker-js/faker';

const password = faker.internet.password();

export const userMock: any = () => {
  return {
    email: faker.internet.email(),
    password: password,
    passwordConfirmation: password,
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    phone: faker.phone.number(),
    birthDay: new Date(),
    isRememberMe: false,
  };
};
