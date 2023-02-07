import request from 'supertest';
import { v4 as uuid } from 'uuid';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import UsersRepository from '../../../src/dbEntities/UsersEntity';
import appDatasource from '../../../db/app-datasource';
import { dropAllTestData, insertSeedData } from '../seedData';
import { userTony } from '../seedData/usersData';

jest.mock('uuid', () => ({ v4: jest.fn() }));

const STUB_UUID_RESPONSE = '1923ccee-d63b-46bd-84fb-edf65936a6d7';


describe('POST /users', () => {
  beforeAll(async () => {
    (uuid as jest.Mock).mockReturnValue(STUB_UUID_RESPONSE);
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

  test('I can create a new user', async () => {
    const inputData = {
      email: 'dingleberry@tests.co.uk',
      password: 'training',
    };
    const { body } = await request(app)
      .post('/access/users')
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
    expect(user?.passwordHash)
      .not
      .toEqual(password);
  });

  test('I can create a user with a username', async () => {
    const inputData = {
      email: 'dingleberry@tests.co.uk',
      username: 'tobias',
      password: 'training',
    };
    const { body } = await request(app)
      .post('/access/users')
      .send(inputData)
      .expect(201);
    const { password, ...inputDataMinusPassword } = inputData;
    expect(body)
      .toEqual({
        ...inputDataMinusPassword,
        id: STUB_UUID_RESPONSE,
      });
    const usersRepository = testDatasource.getRepository(UsersRepository);
    const user = await usersRepository.findOneBy({ username: inputData.username });
    expect(user)
      .toMatchObject({ ...inputDataMinusPassword, id: STUB_UUID_RESPONSE });
    expect(user?.passwordHash)
      .not
      .toEqual(password);
  });

  describe('Errors', () => {
    describe('Bad Requests', () => {
      test('I cannot create a user if I do not provide an email address', async () => {
        const inputData = { password: 'pw' };
        const { body } = await request(app)
          .post('/access/users')
          .send(inputData)
          .expect(400);
        expect(body)
          .toEqual({
            errors: [
              {
                message: 'should have required property \'email\'',
                path: '.body.email',
              },
            ],
            message: 'Bad Request',
          });
      });

      test('I cannot create a user if I do not provide a password', async () => {
        const inputData = { email: 'pw' };
        const { body } = await request(app)
          .post('/access/users')
          .send(inputData)
          .expect(400);
        expect(body)
          .toEqual({
            errors: [
              {
                message: 'should have required property \'password\'',
                path: '.body.password',
              },
            ],
            message: 'Bad Request',
          });
      });
    });

    describe ('Conflicts', () => {
      test('I cannot create a user if one already exists with the same email address', async () => {
        const inputData = {
          email: userTony.user.email,
          password: 'anyoldpassword',
        };
        const { body } = await request(app)
          .post('/access/users')
          .send(inputData)
          .expect(409);
        expect(body)
          .toEqual({ message: 'A user with the supplied email address already exists' });
      });
    });
  });
});
