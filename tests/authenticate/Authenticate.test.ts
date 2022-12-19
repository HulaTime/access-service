import request from 'supertest';
import * as argon2 from 'argon2';
import { Like } from 'typeorm';

import app from '../../src/app';
import testDatasource from '../test-datasource';
import appDatasource from '../../db/app-datasource';
import { AccountsRepository, ApplicationsRepository } from '../../src/repositories';

const ACCOUNT_SEED_1 = {
  id: 'a1a54a0c-907d-4704-98fd-68dfb614f4a8',
  name: 'test account 1',
  description: 'test',
};

const CLIENT_ID = '01c3b4b0-d9ca-47d7-9427-f016f2741223';
const CLIENT_SECRET = 'big secret';

const APPLICATION_SEED_1 = {
  id: '21865c17-e882-423b-b0e6-e4b86bc83544',
  account: { id: ACCOUNT_SEED_1.id },
  name: 'application 1 test',
  clientId: CLIENT_ID,
  description: 'test',
};

describe('POST /authenticate', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
    const accountsRepository = testDatasource.getRepository(AccountsRepository);
    await accountsRepository.insert(ACCOUNT_SEED_1);
    const applicationsRepository = testDatasource.getRepository(ApplicationsRepository);
    await applicationsRepository.insert({
      ...APPLICATION_SEED_1,
      clientSecret: await argon2.hash(CLIENT_SECRET),
    });
  });

  afterAll(async () => {
    const applicationRepository = testDatasource.getRepository(ApplicationsRepository);
    await applicationRepository.delete({ description: Like('%test%') });

    const accountsRepository = testDatasource.getRepository(AccountsRepository);
    await accountsRepository.delete({ name: Like('%test%') });

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
      expect(body.accessToken).toBeDefined();
    });
  });
});
