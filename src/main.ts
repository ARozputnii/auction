import { NestFactory } from '@nestjs/core';
import { AppModule } from '#app-root/app.module';
import { ValidationPipe } from '@nestjs/common';

async function start() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  await app.listen(process.env.PORT);
}
start();
