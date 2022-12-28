import request from 'supertest';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import appDatasource from '../../../db/app-datasource';
import AccessToken from '../../../src/lib/AccessToken';
import { dropAllTestData, insertSeedData } from '../seedData';
import { alphaAccount } from '../seedData/accountsData';

describe('GET /accounts/:id', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
    await insertSeedData();
  });

  afterAll(async () => {
    await dropAllTestData();
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  test('I can get an account by id', async () => {
    const { body } = await request(app)
      .get(`/access/accounts/${alphaAccount.id}`)
      .set('authorization', new AccessToken('user').sign())
      .send()
      .expect(200);
    expect(body)
      .toMatchObject(alphaAccount);
  });
});
