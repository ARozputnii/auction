import { NestFactory } from '@nestjs/core';
import { SeederModule } from '#app-root/database/seeds/seeder.module';
import { SeederService } from '#app-root/database/seeds/seeder.service';

async function runSeeds() {
  const appContext = await NestFactory.createApplicationContext(SeederModule);

  await appContext.get<SeederService>(SeederService).run();
}

runSeeds();
