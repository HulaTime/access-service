/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unused-vars */
import request from 'supertest';

import app from '../../../../src/app';
import testDatasource from '../../../test-datasource';
import appDatasource from '../../../../db/app-datasource';
import { ApplicationsEntity } from '../../../../src/dbEntities';
import { components } from '../../../../types/api';
import AccessToken from '../../../../src/lib/AccessToken';
import { dropAllTestData, insertSeedData } from '../../seedData';
import { alphaAccount } from '../../seedData/accountsData';

describe('POST /accounts/:id/roles', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
  });

  beforeEach(async () => {
    await insertSeedData();
  });

  afterEach(async () => {
    await dropAllTestData();
  });

  afterAll(async () => {
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  describe('Having obtained valid user credentials', () => {
    test('I create a new application for an existing account', async () => {
      const accountAppReqData: components['schemas']['AccountAppRequest'] = {
        name: 'my new application',
        description: 'generic information',
      };
      const { body } = await request(app)
        .post(`/access/accounts/${alphaAccount.id}/roles`)
        .set('authorization', new AccessToken('user').sign())
        .send(accountAppReqData)
        // .expect(201);
      expect(body).toMatchObject({
        ...accountAppReqData,
        accountId: alphaAccount.id,
        id: expect.any(String),
        clientId: expect.any(String),
        clientSecret: expect.any(String),
      });
      const applicationsRepository = testDatasource.getRepository(ApplicationsEntity);
      const dbAccountApp = await applicationsRepository.findOneBy({ id: body.id });
      expect(dbAccountApp).toBeDefined();
      const { clientSecretHash: csa, ...dbData } = dbAccountApp!;
      const { clientSecret: csb, accountId, ...responseData } = body;
      expect(dbData).toEqual(responseData);
    });
  });
});
