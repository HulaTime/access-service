import { DataSource } from 'typeorm';

import Account from '../src/repositories/AccountsRepository';
import Users from '../src/repositories/UsersRepository';
import Applications from '../src/repositories/ApplicationsRepository';
import Roles from '../src/repositories/RolesRepository';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 54320,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  // logging: true,
  entities: [Account, Users, Applications, Roles],
});
