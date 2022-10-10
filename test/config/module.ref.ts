import { Test } from '@nestjs/testing';

export const moduleRef = async (module) => {
  return await Test.createTestingModule({
    imports: [module],
  }).compile();
};
