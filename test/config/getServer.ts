import { moduleRef } from '#test/config/module.ref';
import { AppModule } from '#app-root/app.module';
import { ValidationPipe } from '@nestjs/common';

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
