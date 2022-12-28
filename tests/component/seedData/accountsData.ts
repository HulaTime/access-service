import Account from '../../../src/models/Account';

export const alphaAccount: Account = new Account({
  id: 'cc961a77-6f36-43f4-805e-689049efa88a',
  name: 'test account alpha',
  description: 'a test account',
});

export const bravoAccount: Account = new Account({
  id: '22e2c3fd-93a0-451e-a9a6-d5fbc154c6fa',
  name: 'test account bravo',
  description: 'a test account',
});

export default [
  alphaAccount,
  bravoAccount,
];
