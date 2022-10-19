import request from 'supertest';
import { Like } from 'typeorm';

import app from '../../src/app';
import testDatasource from '../test-datasource';
import AccountsRepository from '../../src/repositories/AccountsRepository';
import UsersRepository from '../../src/repositories/UsersRepository';
import appDatasource from '../../db/app-datasource';

describe('POST /accounts', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
  });

  afterEach(async () => {
    const accountsRepository = testDatasource.getRepository(AccountsRepository);
    await accountsRepository.delete({ name: Like('%test%') });

    const usersRepository = testDatasource.getRepository(UsersRepository);
    await usersRepository.delete({ email: Like('%test%') });
  });

  afterAll(async () => {
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  test('I can create a new account', async () => {
    const inputData = {
      name: 'test-account',
      email: 'dingleberry@tests.co.uk',
      password: 'training',
      description: 'this is a test account'
    };
    const { body } = await request(app)
      .post('/access/accounts')
      .send(inputData)
      .expect(201);
    const { password, ...inputDataMinusPassword } = inputData;
    expect(body)
      .toMatchObject(inputDataMinusPassword);
    expect(body.id)
      .toBeDefined();
    const accountsRepository = testDatasource.getRepository(AccountsRepository);
    const createdAccount = await accountsRepository.findOneBy({ name: 'test-account' });
    expect(createdAccount)
      .toMatchObject({ name: inputData.name, description: inputData.description });
    expect(createdAccount?.id)
      .toBeDefined();

    const usersRepository = testDatasource.getRepository(UsersRepository);
    const user = await usersRepository.findOneBy({ email: inputData.email });
    expect(user)
      .toBeDefined();
    expect(user?.password)
      .not
      .toEqual(password);
  });

  test('I cannot create an account with an invalid payload', async () => {
    const badInputData = {
      foo: 'bar',
    };
    const { body } = await request(app)
      .post('/access/accounts')
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

  test('I cannot create more than one account with the same email', async () => {
    const inputData = {
      name: 'test-account',
      email: 'dingleberry@tests.co.uk',
      password: 'training',
      description: 'this is a test account'
    };
    await request(app)
      .post('/access/accounts')
      .send(inputData)
      .expect(201);
    const { body } = await request(app)
      .post('/access/accounts')
      .send(inputData)
      .expect(409);
    expect(body).toEqual({
      message: `User ${inputData.email} already has an account`
    });
    const accountsRepository = testDatasource.getRepository(AccountsRepository);
    const accounts = await accountsRepository.findBy({ name: 'test-account' });
    expect(accounts).toHaveLength(1);
    const usersRepository = testDatasource.getRepository(UsersRepository);
    const users = await usersRepository.findBy({ email: inputData.email });
    expect(users).toHaveLength(1);
  });
});
