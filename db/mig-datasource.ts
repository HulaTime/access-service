import { DataSource } from 'typeorm';

import Account from '../repositories/Account';
import Users from '../repositories/Users';

export const AccessDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  // synchronize: true,
  logging: true,
  entities: [Account, Users],
  subscribers: [],
  migrations: ['./db/migrations/*'],
  migrationsTableName: 'access_migrations'
});
