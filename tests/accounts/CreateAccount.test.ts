import request from 'supertest';
import { Like } from 'typeorm';

import app from '../../src/app';
import datasource from '../test-datasource';
import AccountsRepository from '../../src/repositories/AccountsRepository';
import UsersRepository from '../../src/repositories/UsersRepository';

describe('POST /accounts', () => {

  beforeEach(async () => {
    await datasource.initialize();
  });

  afterEach(async () => {
    const accountsRepository = datasource.getRepository(AccountsRepository);
    await accountsRepository.delete({ name: Like('%test%') });

    const usersRepository = datasource.getRepository(UsersRepository);
    await usersRepository.delete({ email: Like('%test%') });
    await datasource.destroy();
  });

  test('I can create a new account', async () => {
    const inputData = {
      name: 'test-account',
      email: 'dingleberry@tests.co.uk',
      password: 'training',
      description: 'this is a test account'
    };
    const { body } = await request(app).post('/access/accounts')
      .send(inputData)
      .expect(201);
    const { password, ...inputDataMinusPassword } = inputData;
    expect(body).toMatchObject(inputDataMinusPassword);
    expect(body.id).toBeDefined();
    const accountsRepository = datasource.getRepository(AccountsRepository);
    const createdAccount = await accountsRepository.findOneBy({ name: 'test-account' });
    expect(createdAccount).toMatchObject({ name: inputData.name, description: inputData.description });
    expect(createdAccount?.id).toBeDefined();

    const usersRepository = datasource.getRepository(UsersRepository);
    const user = await usersRepository.findOneBy({ email: inputData.email });
    expect(user).toBeDefined();
    expect(user?.password).not.toEqual(password);
  });

  test('I cannot create an account with an invalid payload', async () => {
    const badInputData = {
      foo: 'bar',
    };
    const { body } = await request(app).post('/access/accounts')
      .send(badInputData)
      .expect(400);
    expect(body).toEqual({
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
        {
          errorCode: 'required.openapi.validation',
          message: 'should have required property \'email\'',
          path: '.body.email',
        },
        {
          errorCode: 'required.openapi.validation',
          message: 'should have required property \'password\'',
          path: '.body.password',
        },
      ],
      message: 'request.body should NOT have additional properties, request.body should have required property \'name\', request.body should have required property \'email\', request.body should have required property \'password\'',
    });
  });
})
;
