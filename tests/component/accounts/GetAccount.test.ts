import request from 'supertest';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import appDatasource from '../../../db/app-datasource';
import AccessToken from '../../../src/lib/AccessToken';
import { AccountsEntity } from '../../../src/dbEntities';

const ACCOUNT_1_ID = '60226823-ccbc-4d46-beb9-96a60d90d564';

const ACCOUNT_1 = {
  id: ACCOUNT_1_ID,
  name: 'test account one',
  description: 'a test account',
};

describe('GET /accounts/:id', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    await accountsEntity.insert(ACCOUNT_1);
  });

  afterAll(async () => {
    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    await accountsEntity.delete({ id: ACCOUNT_1_ID });
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  test('I can get an account by id', async () => {
    const { body } = await request(app)
      .get(`/access/accounts/${ACCOUNT_1_ID}`)
      .set('authorization', new AccessToken().output())
      .send()
      .expect(200);
    expect(body)
      .toMatchObject(ACCOUNT_1);
  });
});
