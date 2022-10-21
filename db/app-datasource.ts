import { DataSource } from 'typeorm';

import Accounts from '../src/repositories/AccountsRepository';
import Users from '../src/repositories/UsersRepository';
import Applications from '../src/repositories/ApplicationsRepository';
import Roles from '../src/repositories/RolesRepository';
import Policies from '../src/repositories/PoliciesRepository';

const datasource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  // logging: true,
  entities: [Accounts, Users, Applications, Roles, Policies],
});

datasource.initialize();

export default datasource;
