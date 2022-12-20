import request from 'supertest';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import appDatasource from '../../../db/app-datasource';
import { AccountsRepository, ApplicationsRepository } from '../../../src/repositories';
import { components } from '../../../types/api';

const ACCOUNT_1_ID = '60226823-ccbc-4d46-beb9-96a60d90d564';

const ACCOUNT_1 = {
  id: ACCOUNT_1_ID,
  name: 'test account one',
  description: 'a test account',
};

describe('POST /accounts/:id/applications', () => {
  beforeAll(async () => {
    await testDatasource.initialize();

    const accountsRepository = testDatasource.getRepository(AccountsRepository);
    await accountsRepository.insert(ACCOUNT_1);
  });

  afterEach(async () => {
    const accountsRepository = testDatasource.getRepository(AccountsRepository);
    const applicationsRepository = testDatasource.getRepository(ApplicationsRepository);

    await applicationsRepository.delete({ account: { id: ACCOUNT_1_ID } });
    await accountsRepository.delete({ id: ACCOUNT_1_ID });
  });

  afterAll(async () => {
    const accountsRepository = testDatasource.getRepository(AccountsRepository);
    await accountsRepository.delete({ id: ACCOUNT_1_ID });

    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  test('I create a new application for an existing application', async () => {
    const accountAppReqData: components['schemas']['AccountAppRequest'] = {
      name: 'my new account',
      description: 'generic information',
    };
    const { body } = await request(app)
      .post(`/access/accounts/${ACCOUNT_1_ID}/applications`)
      .send(accountAppReqData)
      .expect(201);
    expect(body).toMatchObject(accountAppReqData);
    expect(body.id).toBeDefined();
    expect(body.clientId).toBeDefined();
    expect(body.clientSecret).toBeDefined();
    expect(body.accountId).toEqual(ACCOUNT_1_ID);
    const applicationsRepository = testDatasource.getRepository(ApplicationsRepository);
    const dbAccountApp = await applicationsRepository.findOneBy({ id: body.id });
    expect(dbAccountApp).toBeDefined();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-non-null-assertion
    const { clientSecret: csa, ...dbData } = dbAccountApp!;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { clientSecret: csb, accountId, ...responseData } = body;
    expect(dbData).toEqual(responseData);
  });
});