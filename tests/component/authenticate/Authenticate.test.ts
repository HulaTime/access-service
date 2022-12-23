import request from 'supertest';
import * as argon2 from 'argon2';
import { Like } from 'typeorm';
import { decode } from 'jsonwebtoken';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import appDatasource from '../../../db/app-datasource';
import { AccountsEntity, ApplicationsEntity, UsersEntity } from '../../../src/dbEntities';

const ACCOUNT_SEED_1 = {
  id: 'a1a54a0c-907d-4704-98fd-68dfb614f4a8',
  name: 'test account 1',
  description: 'test',
};

const CLIENT_ID = '01c3b4b0-d9ca-47d7-9427-f016f2741223';
const CLIENT_SECRET = 'big secret';

const APPLICATION_SEED_1: Omit<ApplicationsEntity, 'clientSecret'> = {
  id: '21865c17-e882-423b-b0e6-e4b86bc83544',
  account: { id: ACCOUNT_SEED_1.id, name: ACCOUNT_SEED_1.name },
  name: 'application 1 test',
  clientId: CLIENT_ID,
  description: 'test',
};

const USER_1_EMAIL_ADDRESS = 'john@doe.com';
const USER_1_USERNAME = 'johndoe';
const USER_1_PW = 'clams';
const USER_SEED_1: Omit<UsersEntity, 'password'> = {
  id: 'da4aca43-f880-4739-93e6-396497170cb5',
  email: USER_1_EMAIL_ADDRESS,
  username: USER_1_USERNAME,
};

describe('POST /authenticate', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    await accountsEntity.insert(ACCOUNT_SEED_1);
    const applicationsRepository = testDatasource.getRepository(ApplicationsEntity);
    await applicationsRepository.insert({
      ...APPLICATION_SEED_1,
      clientSecret: await argon2.hash(CLIENT_SECRET),
    });

    const usersRepository = testDatasource.getRepository(UsersEntity);
    await usersRepository.insert({
      ...USER_SEED_1,
      password: await argon2.hash(USER_1_PW),
    });
  });

  afterAll(async () => {
    const applicationRepository = testDatasource.getRepository(ApplicationsEntity);
    await applicationRepository.delete({ description: Like('%test%') });

    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    await accountsEntity.delete({ name: Like('%test%') });

    const usersRepository = testDatasource.getRepository(UsersEntity);
    await usersRepository.delete({ id: USER_SEED_1.id });

    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  describe('Applications', () => {
    test('I can exchange clientId and clientSecret for an access token', async () => {
      const inputData = {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      };
      const { body } = await request(app)
        .post('/access/authenticate')
        .send(inputData)
        .expect(200);
      const { accessToken } = body;
      expect(accessToken).toBeDefined();
      expect(decode(accessToken)?.sub).toEqual(APPLICATION_SEED_1.id);
    });
  });

  describe('Users', () => {
    test('I can exchange email and password for an access token', async () => {
      const inputData = {
        email: USER_1_EMAIL_ADDRESS,
        password: USER_1_PW,
      };
      const { body } = await request(app)
        .post('/access/authenticate')
        .send(inputData)
        .expect(200);
      const { accessToken } = body;
      expect(accessToken).toBeDefined();
      expect(decode(accessToken)?.sub).toEqual(USER_SEED_1.id);
    });

    test('I can exchange username and password for an access token', async () => {
      const inputData = {
        username: USER_1_USERNAME,
        password: USER_1_PW,
      };
      const { body } = await request(app)
        .post('/access/authenticate')
        .send(inputData)
        .expect(200);
      const { accessToken } = body;
      expect(accessToken).toBeDefined();
      expect(decode(accessToken)?.sub).toEqual(USER_SEED_1.id);
    });
  });
});