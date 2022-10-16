import request from 'supertest';
import { Like } from 'typeorm';

import app from '../../src/app';
import datasource from '../test-datasource';
import AccountsRepository from '../../src/repositories/AccountsRepository';

describe ('POST /accounts', () => {

  beforeEach(async () => {
    await datasource.initialize();
  });

  afterEach(async () => {
    const accountsRepository = datasource.getRepository(AccountsRepository);
    await accountsRepository.delete({ name: Like('%test%') });
  });

  test('I can create a new account',  async () => {
    const inputData = {
      name: 'test-account',
      description: 'this is a test account'
    };
    const { body } = await request(app).post('/access/accounts')
      .send( inputData)
      .expect(201);
    expect(body).toMatchObject(inputData);
    expect(body.id).toBeDefined();
    const accountsRepository = datasource.getRepository(AccountsRepository);
    const createdAccount = await accountsRepository.findOneBy({ name: 'test-account' });
    expect(createdAccount).toMatchObject(inputData);
    expect(createdAccount?.id).toBeDefined();
  });
});
