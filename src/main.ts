import { NestFactory } from '@nestjs/core';
import { AppModule } from '#app-root/app.module';
import { ValidationPipe } from '@nestjs/common';
import { setupSwagger } from '#app-root/utils/setup-swagger.util';

async function start() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  if (process.env.NODE_ENV === 'dev') {
    setupSwagger(app);
  }

  await app.listen(process.env.PORT);
}
start();
