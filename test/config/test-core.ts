import { TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { DatabaseService } from '#app-root/database/database.service';
import { Connection } from 'mongoose';
import { SuperTest } from 'supertest';
import * as request from 'supertest';

export class TestCore {
  constructor(
    protected readonly _app: INestApplication,
    protected readonly _module: TestingModule,
  ) {}

  public get app() {
    return this._app;
  }

  public get module() {
    return this._module;
  }

  public get dbConnection(): Connection {
    return this.module.get<DatabaseService>(DatabaseService).getDbHandle();
  }

  public get httpRequest(): SuperTest<any> {
    return request(this.app.getHttpServer());
  }

  public async closeApp(): Promise<void> {
    await this.dbConnection.close();

    return this.app.close();
  }
}
