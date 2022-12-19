import { DataSource } from 'typeorm';

import Accounts from '../src/repositories/AccountsRepository';
import Users from '../src/repositories/UsersRepository';
import Applications from '../src/repositories/ApplicationsRepository';
import Roles from '../src/repositories/RolesRepository';
import Policies from '../src/repositories/PoliciesRepository';

export const AccessDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 54320,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  logging: false,
  entities: [Accounts, Users, Applications, Roles, Policies],
  subscribers: [],
  migrations: ['./db/migrations/*'],
  migrationsTableName: 'access_migrations'
});

