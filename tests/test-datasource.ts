import { DataSource } from 'typeorm';

import Account from '../src/repositories/AccountsRepository';
import Users from '../src/repositories/UsersRepository';
import Applications from '../src/repositories/Applications';
import Roles from '../src/repositories/Roles';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  // logging: true,
  entities: [Account, Users, Applications, Roles],
});
