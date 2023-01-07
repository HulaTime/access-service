import { DataSource } from 'typeorm';

import Accounts from '../src/dbEntities/AccountsEntity';
import Users from '../src/dbEntities/UsersEntity';
import Applications from '../src/dbEntities/ApplicationsEntity';
import Roles from '../src/dbEntities/RolesEntity';
import Policies from '../src/dbEntities/PoliciesEntity';

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
  migrationsTableName: 'migrations',
});

