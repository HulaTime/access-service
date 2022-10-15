import { DataSource } from 'typeorm';

import Account from '../repositories/Account';
import Users from '../repositories/Users';
import Applications from '../repositories/Applications';
import Roles from '../repositories/Roles';

export const AccessDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  logging: true,
  entities: [Account, Users, Applications, Roles],
  subscribers: [],
  migrations: ['./db/migrations/*'],
  migrationsTableName: 'access_migrations'
});
