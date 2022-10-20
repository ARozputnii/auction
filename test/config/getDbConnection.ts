import { moduleRef } from '#test/config/module.ref';
import { AppModule } from '#app-root/app.module';
import { DatabaseService } from '#app-root/database/database.service';

const getDbConnection = async () => {
  const module = await moduleRef(AppModule);
  return module.get<DatabaseService>(DatabaseService).getDbHandle();
};

export default getDbConnection;
