import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '../../../../src/app';
import { PoliciesEntity } from '../../../../src/dbEntities';
import testDatasource from '../../../test-datasource';
import AccessToken from '../../../../src/lib/AccessToken';
import appDatasource from '../../../../db/app-datasource';
import { dropAllTestData, insertSeedData } from '../../seedData';
import { alphaAccountOwner } from '../../seedData/usersData';
import { components } from '../../../../types/api';
import { alphaAccount } from '../../seedData/accountsData';

jest.mock('uuid', () => ({ v4: jest.fn() }));

const STUB_UUID_RESPONSE = '1923ccee-d63b-46bd-84fb-edf65936a6d7';

describe('POST /accounts', () => {
  beforeAll(async () => {
    (uuid as jest.Mock).mockReturnValue(STUB_UUID_RESPONSE);
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

  describe('Obtained valid user token', () => {
    const userAccessToken = new AccessToken('user', { sub: alphaAccountOwner.user.id });

    const createAccountPolicyReqData: components['schemas']['PolicyRequest'] = { content: {} };

    test('I can create a new account policy', async () => {
      const { body } = await request(app)
        .post(`/access/accounts/${alphaAccount.id}`)
        .set('authorization', userAccessToken.sign())
        .send(createAccountPolicyReqData)
        .expect(201);
      expect(body)
        .toEqual({
          ...createAccountPolicyReqData,
          id: STUB_UUID_RESPONSE,
        });
      const policiesRepository = testDatasource.getRepository(PoliciesEntity);
      const createdPolicy = await policiesRepository.findOneBy({ id: STUB_UUID_RESPONSE });
      expect(createdPolicy).toMatchObject({
        ...createAccountPolicyReqData,
        id: STUB_UUID_RESPONSE,
      });
    });
  });

});
