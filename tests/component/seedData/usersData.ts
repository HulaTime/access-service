import User from '../../../src/models/User';

type UserData = { user: User; password: string }

export const userTonyPassword = 'flipcup';

export const userTony: UserData = {
  user: new User({
    id: 'a79a9b47-f9fa-4124-9597-349fe8bf5bdd',
    email: 'alphaOwner@test.com',
    username: 'tonybaloney',
  }),
  password: userTonyPassword,
};

export default [
  userTony,
];
