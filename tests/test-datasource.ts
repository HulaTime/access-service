import { DataSource } from 'typeorm';

import Account from '../src/dbEntities/AccountsEntity';
import Users from '../src/dbEntities/UsersEntity';
import Applications from '../src/dbEntities/ApplicationsEntity';
import Roles from '../src/dbEntities/RolesEntity';
import Policies from '../src/dbEntities/PoliciesEntity';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 54320,
  username: 'myspoke',
  password: 'myspoke',
  database: 'myspoke',
  schema: 'access',
  // logging: true,
  entities: [Account, Users, Applications, Roles, Policies],
});
