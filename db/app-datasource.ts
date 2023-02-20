import { DataSource } from 'typeorm';

import Accounts from '../src/database/typeorm/entities/AccountsEntity';
import Users from '../src/database/typeorm/entities/UsersEntity';
import Applications from '../src/database/typeorm/entities/ApplicationsEntity';
import Roles from '../src/database/typeorm/entities/RolesEntity';
import Policies from '../src/database/typeorm/entities/PoliciesEntity';

const datasource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 54320,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  // logging: true,
  entities: [Accounts, Users, Applications, Roles, Policies],
});

const getInitializedDatasource = (): () => Promise<DataSource> => {
  let initializedDatasource: DataSource;

  return async (): Promise<DataSource> => {
    if (!initializedDatasource) {
      initializedDatasource = await datasource.initialize();
    }
    return initializedDatasource;
  };
};

export default getInitializedDatasource();
