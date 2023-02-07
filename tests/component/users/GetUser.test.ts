import request from 'supertest';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import appDatasource from '../../../db/app-datasource';
import { dropAllTestData, insertSeedData } from '../seedData';
import { userTony } from '../seedData/usersData';
import AccessToken from '../../../src/lib/AccessToken';

describe('Get /users/:userId', () => {
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

  describe('I have been authenticated as an existing user', () => {
    const accessToken = new AccessToken('user', { sub: userTony.user.id }).sign();

    test('I can make a successful get request for that user', async () => {
      const { body } = await request(app)
        .get(`/access/users/${userTony.user.id}`)
        .set('authorization', accessToken)
        .send()
        .expect(200);
      expect(body)
        .toEqual(userTony.user);
    });

    test('I cannot get a user that I have not been authenticated for', async() => {
      const notTonysAccessToken = new AccessToken('user', { sub: 'da289c52-d1f1-4060-aee8-ede0ce4a2f47' }).sign();
      const { body } = await request(app)
        .get(`/access/users/${userTony.user.id}`)
        .set('authorization', notTonysAccessToken)
        .send()
        .expect(404);
      expect(body)
        .toEqual({ message: 'The user does not exist' });
    });
  });
});
