import request from 'supertest';

import testDatasource from '../../test-datasource';
import appDatasource from '../../../db/app-datasource';
import { AccountsEntity } from '../../../src/dbEntities';
import Account from '../../../src/models/Account';
import app from '../../../src/app';
import AccessToken from '../../../src/lib/AccessToken';

const ACCOUNT_1 = new Account({
  id: 'b5e60f80-4eee-4e26-9b50-f3565a6e39dd',
  name: 'account-1-test',
});

const ACCOUNT_2 = new Account({
  id: 'e7a92260-04fd-430d-a0f5-808ed51e42f2',
  name: 'account-2-test',
});

const accounts = [ACCOUNT_1, ACCOUNT_2];

describe('ListAccounts', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    const accountSeeds = accounts.map(account => accountsEntity.insert(account));
    await Promise.all(accountSeeds);
  });

  afterAll(async () => {
    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    const accountSeeds = accounts.map(account => accountsEntity.delete({ id: account.id }));
    await Promise.all(accountSeeds);
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  test('I can list all the accounts', async () => {
    const { body } = await request(app)
      .get('/access/accounts')
      .set('authorization', new AccessToken().sign())
      .send()
      .expect(200);
    expect(body).toHaveLength(2);
    expect(body).toEqual([
      { id: ACCOUNT_1.id, name: ACCOUNT_1.name },
      { id: ACCOUNT_2.id, name: ACCOUNT_2.name },
    ]);
  });
});
