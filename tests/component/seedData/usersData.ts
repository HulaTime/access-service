import User from '../../../src/models/User';

import { alphaAccount, bravoAccount } from './accountsData';

type UserData =  { user: User; password: string }

export const alphaAccountOwnerPassword = 'tressles';

export const alphaAccountOwner: UserData = {
  user: new User({
    id: 'a79a9b47-f9fa-4124-9597-349fe8bf5bdd',
    email: 'alphaOwner@test.com',
    username: 'alphaowner',
  }, alphaAccount),
  password: alphaAccountOwnerPassword,
};

export const bravoAccountOwnerPassword = 'pebbles';

export const bravoAccountOwner: UserData = {
  user: new User({
    id: 'ed97f677-15aa-4a68-b3e5-b02842d81a89',
    email: 'bravoOwner@test.com',
    username: 'bravoowner',
  }, bravoAccount),
  password: bravoAccountOwnerPassword,
};

export const noAccountUserTonyPassword = 'ewfjkdscm';

export const noAccountUserTony: UserData = {
  user: new User({
    id: '4c87b3f4-196c-4f40-bf09-74bec1dd4b5d',
    email: 'tony@baloney.com',
  }),
  password: noAccountUserTonyPassword,
};

export default [
  alphaAccountOwner,
  bravoAccountOwner,
  noAccountUserTony,
];
