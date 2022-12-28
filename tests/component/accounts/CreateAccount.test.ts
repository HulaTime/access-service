import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import AccountsEntity from '../../../src/dbEntities/AccountsEntity';
import appDatasource from '../../../db/app-datasource';
import AccessToken from '../../../src/lib/AccessToken';
import { UsersEntity } from '../../../src/dbEntities';
import { dropAllTestData, insertSeedData } from '../seedData';
import { noAccountUserTony } from '../seedData/usersData';

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

  afterEach((async () => {
    await dropAllTestData();
  }));

  afterAll(async () => {
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  describe('Obtained valid user token', () => {
    const userAccessToken = new AccessToken(
      'user',
      { sub: noAccountUserTony.user.id },
    );

    const createAccountReqData = {
      name: 'test-account',
      description: 'this is a test account',
    };

    test('I can create a new account', async () => {
      const { body } = await request(app)
        .post('/access/accounts')
        .set('authorization', userAccessToken.sign())
        .send(createAccountReqData)
        .expect(201);
      expect(body)
        .toEqual({
          ...createAccountReqData,
          id: STUB_UUID_RESPONSE,
        });
      const accountsEntity = testDatasource.getRepository(AccountsEntity);
      const createdAccount = await accountsEntity.findOneBy({ name: 'test-account' });
      expect(createdAccount).toMatchObject({
        ...createAccountReqData,
        id: STUB_UUID_RESPONSE,
      });
    });

    test('The new account should be associated with the user who created it', async () => {
      const { body } = await request(app)
        .post('/access/accounts')
        .set('authorization', userAccessToken.sign())
        .send(createAccountReqData)
        .expect(201);
      expect(body)
        .toEqual({
          ...createAccountReqData,
          id: STUB_UUID_RESPONSE,
        });
      const userEntity = testDatasource.getRepository(UsersEntity);
      const [user] = await userEntity.find({
        where: { id: noAccountUserTony.user.id },
        relations: { account: true },
      });
      expect(user?.account).toEqual(body);
    });
  });

  describe('Failure scenarios', () => {
    test('I cannot create an account without an authorization token', async () => {
      const inputData = {
        name: 'test-account',
        description: 'this is a test account',
      };
      const { body } = await request(app)
        .post('/access/accounts')
        .send(inputData)
        .expect(401);
      expect(body)
        .toEqual({ message: 'No authorization header provided' });
    });

    test('I cannot create an account with a malformed authorization token', async () => {
      const inputData = {
        name: 'test-account',
        description: 'this is a test account',
      };
      const { body } = await request(app)
        .post('/access/accounts')
        .set('authorization', 'imabadtoken')
        .send(inputData)
        .expect(401);
      expect(body)
        .toEqual({ message: 'The supplied accessToken is not valid' });
    });

    test('I cannot create an account with an invalid payload', async () => {
      const badInputData = { foo: 'bar' };
      const { body } = await request(app)
        .post('/access/accounts')
        .set('authorization', new AccessToken('user').sign())
        .send(badInputData)
        .expect(400);
      expect(body)
        .toEqual({
          errors: [
            {
              errorCode: 'additionalProperties.openapi.validation',
              message: 'should NOT have additional properties',
              path: '.body.foo',
            },
            {
              errorCode: 'required.openapi.validation',
              message: 'should have required property \'name\'',
              path: '.body.name',
            },
          ],
          message: 'request.body should NOT have additional properties, request.body should have required property \'name\'',
        });
    });

    test('A user can only have one account', async() => {
      (uuid as jest.Mock).mockReturnValueOnce('3fb016d6-3988-4006-a303-706fa50e90d1');
      (uuid as jest.Mock).mockReturnValueOnce('46007371-7119-4561-bc7d-4e60143ed38a');

      const signedUserAccessToken = new AccessToken('user', { sub: noAccountUserTony.user.id }).sign();
      const inputData = { name: 'test-account', description: 'this is a test account' };
      await request(app)
        .post('/access/accounts')
        .set('authorization', signedUserAccessToken)
        .send(inputData)
        .expect(201);
      const { body } = await request(app)
        .post('/access/accounts')
        .set('authorization', signedUserAccessToken)
        .send(inputData)
        .expect(409);
      expect(body).toEqual({ message: 'User already has an account' });
    });
  });
});
