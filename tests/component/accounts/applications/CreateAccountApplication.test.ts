/* eslint-disable @typescript-eslint/no-non-null-assertion,@typescript-eslint/no-unused-vars */
import request from 'supertest';
import { Like } from 'typeorm';
import { decode } from 'jsonwebtoken';

import app from '../../../../src/app';
import testDatasource from '../../../test-datasource';
import appDatasource from '../../../../db/app-datasource';
import { AccountsEntity, ApplicationsEntity, UsersEntity } from '../../../../src/dbEntities';
import { components } from '../../../../types/api';
import AccessToken from '../../../../src/lib/AccessToken';
import Account from '../../../../src/models/Account';
import User from '../../../../src/models/User';

const ACCOUNT_SEED_1: Account = new Account({
  id: 'cc961a77-6f36-43f4-805e-689049efa88a',
  name: 'test account one',
  description: 'a test account',
});

const ACCOUNT_SEED_2: Account = new Account({
  id: '22e2c3fd-93a0-451e-a9a6-d5fbc154c6fa',
  name: 'test account two',
  description: 'a test account',
});

const USER_SEED_1: User = new User({
  id: '0325c4dc-10a2-4758-9bf8-51654e3ece1c',
  email: 'bobo@test.com',
  password: 'safdsdf',
}, ACCOUNT_SEED_1);

describe('POST /accounts/:id/applications', () => {
  beforeAll(async () => {
    await testDatasource.initialize();

    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    await accountsEntity.insert(ACCOUNT_SEED_1);
    await accountsEntity.insert(ACCOUNT_SEED_2);

    const usersEntity = testDatasource.getRepository(UsersEntity);
    await usersEntity.insert(USER_SEED_1);
  });

  afterEach(async () => {
    const applicationsRepository = testDatasource.getRepository(ApplicationsEntity);

    await applicationsRepository.delete({ account: { id: ACCOUNT_SEED_1.id } });
  });

  afterAll(async () => {
    const usersEntity = testDatasource.getRepository(UsersEntity);
    await usersEntity.delete({ email: Like('%test%') });

    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    await accountsEntity.delete({ name: Like('%test%') });

    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  describe('Having obtained valid user credentials', () => {
    const accountAppReqData: components['schemas']['AccountAppRequest'] = {
      name: 'my new application',
      description: 'generic information',
    };

    const userAccessToken = new AccessToken('user', { sub: USER_SEED_1.id });

    test('I create a new application for an existing account', async () => {
      const accountAppReqData: components['schemas']['AccountAppRequest'] = {
        name: 'my new application',
        description: 'generic information',
      };
      const { body } = await request(app)
        .post(`/access/accounts/${ACCOUNT_SEED_1.id}/applications`)
        .set('authorization', new AccessToken('user').sign())
        .send(accountAppReqData)
        .expect(201);
      expect(body).toMatchObject({
        ...accountAppReqData,
        accountId: ACCOUNT_SEED_1.id,
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
        .post(`/access/accounts/${ACCOUNT_SEED_1.id}/applications`)
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
      expect(user.account?.id).toEqual(ACCOUNT_SEED_1.id);
      expect(user.id).toEqual(decode(userAccessToken.sign())?.sub);
    });
  });

  test('I cannot create an account without supplying an auth header', async() => {
    const accountAppReqData: components['schemas']['AccountAppRequest'] = {
      name: 'my new application',
      description: 'generic information',
    };
    const { body } = await request(app)
      .post(`/access/accounts/${ACCOUNT_SEED_1.id}/applications`)
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
      .post(`/access/accounts/${ACCOUNT_SEED_1.id}/applications`)
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
    const userAccessToken = new AccessToken('user', { sub: USER_SEED_1.id });
    const { body } = await request(app)
      .post(`/access/accounts/${ACCOUNT_SEED_2.id}/applications`)
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
    const userAccessToken = new AccessToken('user', { sub: USER_SEED_1.id });
    const { body } = await request(app)
      .post('/access/accounts/754721d0-7355-4c8e-b978-757b059415cb/applications')
      .set('authorization', userAccessToken.sign())
      .send(accountAppReqData)
      .expect(409);
    expect(body).toEqual({ message: 'The account specified does not exist' });
  });
});
