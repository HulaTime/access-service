import { DataSource } from 'typeorm';

import Account from '../src/database/typeorm/entities/AccountsEntity';
import Users from '../src/database/typeorm/entities/UsersEntity';
import Applications from '../src/database/typeorm/entities/ApplicationsEntity';
import Roles from '../src/database/typeorm/entities/RolesEntity';
import Policies from '../src/database/typeorm/entities/PoliciesEntity';

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
