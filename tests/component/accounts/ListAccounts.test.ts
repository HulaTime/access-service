import request from 'supertest';

import testDatasource from '../../test-datasource';
import appDatasource from '../../../db/app-datasource';
import app from '../../../src/app';
import AccessToken from '../../../src/lib/AccessToken';
import { dropAllTestData, insertSeedData } from '../seedData';
import { alphaAccount, bravoAccount } from '../seedData/accountsData';

describe('ListAccounts', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
    await insertSeedData();
  });

  afterAll(async () => {
    await dropAllTestData();
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  test('I can list all the accounts', async () => {
    const { body } = await request(app)
      .get('/access/accounts')
      .set('authorization', new AccessToken('user').sign())
      .send()
      .expect(200);
    expect(body).toHaveLength(2);
    expect(body).toEqual([
      { id: alphaAccount.id, name: alphaAccount.name, description: alphaAccount.description },
      { id: bravoAccount.id, name: bravoAccount.name, description: bravoAccount.description },
    ]);
  });
});
