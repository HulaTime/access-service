import { DataSource } from 'typeorm';

import Accounts from '../src/database/typeorm/entities/AccountsEntity';
import Users from '../src/database/typeorm/entities/UsersEntity';
import Applications from '../src/database/typeorm/entities/ApplicationsEntity';
import Roles from '../src/database/typeorm/entities/RolesEntity';
import Policies from '../src/database/typeorm/entities/PoliciesEntity';

export const AccessDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 54320,
  username: 'mydb',
  password: 'mydb',
  database: 'mydb',
  schema: 'access',
  logging: false,
  entities: [Accounts, Users, Applications, Roles, Policies],
  subscribers: [],
  migrations: ['./db/migrations/*'],
  migrationsTableName: 'migrations',
});

