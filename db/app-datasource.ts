import { DataSource } from 'typeorm';

import AccountsRepository from '../src/repositories/AccountsRepository';
import Users from '../src/repositories/UsersRepository';
import Applications from '../src/repositories/Applications';
import Roles from '../src/repositories/Roles';

const datasource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  // logging: true,
  entities: [AccountsRepository, Users, Applications, Roles],
});

datasource.initialize();

export default datasource;
