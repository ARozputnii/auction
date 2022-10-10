import { DatabaseService } from '../../src/database/database.service';
import { moduleRef } from './module.ref';
import { AppModule } from '../../src/app.module';

const getDbConnection = async () => {
  const module = await moduleRef(AppModule);
  return module.get<DatabaseService>(DatabaseService).getDbHandle();
};

export default getDbConnection;
