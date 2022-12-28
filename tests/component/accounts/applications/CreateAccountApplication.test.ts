/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unused-vars */
import request from 'supertest';
import { decode } from 'jsonwebtoken';

import app from '../../../../src/app';
import testDatasource from '../../../test-datasource';
import appDatasource from '../../../../db/app-datasource';
import { ApplicationsEntity, UsersEntity } from '../../../../src/dbEntities';
import { components } from '../../../../types/api';
import AccessToken from '../../../../src/lib/AccessToken';
import { dropAllTestData, insertSeedData } from '../../seedData';
import { alphaAccountOwner } from '../../seedData/usersData';
import { alphaAccount, bravoAccount } from '../../seedData/accountsData';

describe('POST /accounts/:id/applications', () => {
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
    const accountAppReqData: components['schemas']['AccountAppRequest'] = {
      name: 'my new application',
      description: 'generic information',
    };

    const userAccessToken = new AccessToken('user', { sub: alphaAccountOwner.user.id });

    test('I create a new application for an existing account', async () => {
      const accountAppReqData: components['schemas']['AccountAppRequest'] = {
        name: 'my new application',
        description: 'generic information',
      };
      const { body } = await request(app)
        .post(`/access/accounts/${alphaAccount.id}/applications`)
        .set('authorization', new AccessToken('user').sign())
        .send(accountAppReqData)
        .expect(201);
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
      const { clientSecret: csa, ...dbData } = dbAccountApp!;
      const { clientSecret: csb, accountId, ...responseData } = body;
      expect(dbData).toEqual(responseData);
    });

    test('The account for the application should be determined by the users access credentials', async () => {
      const { body } = await request(app)
        .post(`/access/accounts/${alphaAccount.id}/applications`)
        .set('authorization', userAccessToken.sign())
        .send(accountAppReqData)
        .expect(201);
      const { accountId } = body;
      const usersRepository = testDatasource.getRepository(UsersEntity);
      const [user] = await usersRepository.find(
        {
          where: { account: { id: accountId } },
          relations: { account: true },
        });
      if (!user) {
        throw new Error('No user exists for this test');
      }
      expect(user.account?.id).toEqual(alphaAccount.id);
      expect(user.id).toEqual(decode(userAccessToken.sign())?.sub);
    });
  });

  test('I cannot create an account without supplying an auth header', async() => {
    const accountAppReqData: components['schemas']['AccountAppRequest'] = {
      name: 'my new application',
      description: 'generic information',
    };
    const { body } = await request(app)
      .post(`/access/accounts/${alphaAccount.id}/applications`)
      .send(accountAppReqData)
      .expect(401);
    expect(body).toEqual({ message: 'No authorization header provided' });
  });

  test('I cannot create an account without a valid auth token', async() => {
    const accountAppReqData: components['schemas']['AccountAppRequest'] = {
      name: 'my new application',
      description: 'generic information',
    };
    const { body } = await request(app)
      .post(`/access/accounts/${alphaAccount.id}/applications`)
      .set('authorization', 'ajsfdkjlks')
      .send(accountAppReqData)
      .expect(401);
    expect(body).toEqual({ message: 'The supplied accessToken is not valid' });
  });

  test('An application cannot be created for an account that the user is not associated with', async() => {
    const accountAppReqData: components['schemas']['AccountAppRequest'] = {
      name: 'my new application',
      description: 'generic information',
    };
    const userAccessToken = new AccessToken('user', { sub: alphaAccountOwner.user.id });
    const { body } = await request(app)
      .post(`/access/accounts/${bravoAccount.id}/applications`)
      .set('authorization', userAccessToken.sign())
      .send(accountAppReqData)
      .expect(409);
    expect(body).toEqual({ message: 'The account specified does not exist' });
  });

  test('An application cannot be created for an account that does not exist', async() => {
    const accountAppReqData: components['schemas']['AccountAppRequest'] = {
      name: 'my new application',
      description: 'generic information',
    };
    const userAccessToken = new AccessToken('user', { sub: alphaAccountOwner.user.id });
    const { body } = await request(app)
      .post('/access/accounts/754721d0-7355-4c8e-b978-757b059415cb/applications')
      .set('authorization', userAccessToken.sign())
      .send(accountAppReqData)
      .expect(409);
    expect(body).toEqual({ message: 'The account specified does not exist' });
  });
});
