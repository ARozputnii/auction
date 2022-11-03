import { BullRootModuleOptions } from '@nestjs/bull/dist/interfaces/bull-module-options.interface';

export default () => ({
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  } as BullRootModuleOptions,
});
