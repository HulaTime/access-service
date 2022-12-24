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


describe('POST /accounts/:accountId/users', () => {
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

  test('I can create a new user without specifying an account to associate them with', async () => {
    const inputData = {
      email: 'dingleberry@tests.co.uk',
      password: 'training',
    };
    const { body } = await request(app)
      .post('/access/users')
      .set('authorization', new AccessToken().sign())
      .send(inputData)
      .expect(201);
    const { password, ...inputDataMinusPassword } = inputData;
    expect(body)
      .toEqual({
        ...inputDataMinusPassword,
        id: STUB_UUID_RESPONSE,
      });
    const usersRepository = testDatasource.getRepository(UsersRepository);
    const user = await usersRepository.findOneBy({ email: inputData.email });
    expect(user)
      .toMatchObject({ ...inputDataMinusPassword, id: STUB_UUID_RESPONSE });
    expect(user?.password)
      .not
      .toEqual(password);
  });
});
