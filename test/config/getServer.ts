import { ValidationPipe } from '@nestjs/common';
import { moduleRef } from './module.ref';
import { AppModule } from '../../src/app.module';

const getServer = async () => {
  const module = await moduleRef(AppModule);

  const app = module.createNestApplication().useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api');
  await app.init();

  return app.getHttpServer();
};

export default getServer;
