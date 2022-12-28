import * as argon2 from 'argon2';

import User from '../../../src/models/User';
import Account from '../../../src/models/Account';

describe('User model', () => {
  const account = new Account({
    id: '3c59a926-11b0-4681-be6f-b908b2f19bbd',
    name: 'an account',
  });

  test('I can instantiate a new User with an Account', () => {
    const user = new User({
      id: 'e8f7609b-e755-4524-ac13-a6a3033ccbfb',
      email: 'john@gone.com',
    }, account);
    expect(user).toBeInstanceOf(User);
  });

  test('I can set a password for a user, that should be hashed before storing', async () => {
    const password = 'ploppers';
    const user = new User({
      id: '2d521102-d797-4782-8bec-110962bddfed',
      email: 'boop@goop.noop',
    }, account);
    await user.setPassword(password);
    expect(user.passwordHash).not.toEqual(password);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const isValidPassword = await argon2.verify(user.passwordHash!, password);
    expect(isValidPassword).toBe(true);
  });
});
