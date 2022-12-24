import request from 'supertest';
import { Like } from 'typeorm';
import { v4 as uuid } from 'uuid';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import AccountsEntity from '../../../src/dbEntities/AccountsEntity';
import UsersRepository from '../../../src/dbEntities/UsersEntity';
import appDatasource from '../../../db/app-datasource';
import AccessToken from '../../../src/lib/AccessToken';

jest.mock('uuid', () => ({ v4: jest.fn() }));

const STUB_UUID_RESPONSE = '1923ccee-d63b-46bd-84fb-edf65936a6d7';

describe('POST /accounts', () => {
  beforeAll(async () => {
    (uuid as jest.Mock).mockReturnValue(STUB_UUID_RESPONSE);
    await testDatasource.initialize();
  });

  afterEach(async () => {
    const usersRepository = testDatasource.getRepository(UsersRepository);
    await usersRepository.delete({ email: Like('%test%') });

    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    await accountsEntity.delete({ name: Like('%test%') });
  });

  afterAll(async () => {
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  test('I can create a new account, with an associated user', async () => {
    const inputData = {
      name: 'test-account',
      email: 'dingleberry@tests.co.uk',
      password: 'training',
      description: 'this is a test account',
    };
    const { body } = await request(app)
      .post('/access/accounts')
      .set('authorization', new AccessToken().sign())
      .send(inputData)
      .expect(201);
    const { password, ...inputDataMinusPassword } = inputData;
    expect(body)
      .toEqual({
        ...inputDataMinusPassword,
        id: STUB_UUID_RESPONSE,
      });
    expect(body.id)
      .toBeDefined();
    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    const createdAccount = await accountsEntity.findOneBy({ name: 'test-account' });
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
    const badInputData = { foo: 'bar' };
    const { body } = await request(app)
      .post('/access/accounts')
      .set('authorization', new AccessToken().sign())
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
      description: 'this is a test account',
    };
    await request(app)
      .post('/access/accounts')
      .set('authorization', new AccessToken().sign())
      .send(inputData)
      .expect(201);
    const { body } = await request(app)
      .post('/access/accounts')
      .set('authorization', new AccessToken().sign())
      .send(inputData)
      .expect(409);
    expect(body).toEqual({ message: 'An account already exists for email address provided' });
    const accountsEntity = testDatasource.getRepository(AccountsEntity);
    const accounts = await accountsEntity.findBy({ name: 'test-account' });
    expect(accounts).toHaveLength(1);
    const usersRepository = testDatasource.getRepository(UsersRepository);
    const users = await usersRepository.findBy({ email: inputData.email });
    expect(users).toHaveLength(1);
  });
});
