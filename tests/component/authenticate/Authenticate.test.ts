import request from 'supertest';
import { decode } from 'jsonwebtoken';

import app from '../../../src/app';
import testDatasource from '../../test-datasource';
import appDatasource from '../../../db/app-datasource';
import AccessToken from '../../../src/lib/AccessToken';
import { dropAllTestData, insertSeedData } from '../seedData';
import { alphaAccountApplicationTesco, alphaAccountApplicationTescoClientSecret } from '../seedData/applicationsData';
import { userTony, userTonyPassword } from '../seedData/usersData';

describe('POST /authenticate', () => {
  beforeAll(async () => {
    await testDatasource.initialize();
    await insertSeedData();
  });

  afterAll(async () => {
    await dropAllTestData();
    await appDatasource.destroy();
    await testDatasource.destroy();
  });

  describe('Applications', () => {
    const testRequestData = {
      clientId: alphaAccountApplicationTesco.application.clientId,
      clientSecret: alphaAccountApplicationTescoClientSecret,
    };

    test('I can exchange clientId and clientSecret for an access token', async () => {
      const { body } = await request(app)
        .post('/access/authenticate')
        .send(testRequestData)
        .expect(200);
      const { accessToken } = body;
      expect(accessToken).toBeDefined();
    });

    test('I can verify the returned access token was generated by the access service', async () => {
      const { body } = await request(app)
        .post('/access/authenticate')
        .send(testRequestData)
        .expect(200);
      const { accessToken } = body;
      AccessToken.verify(accessToken);
    });

    test('The returned access token subject should be the applicationId', async () => {
      const { body } = await request(app)
        .post('/access/authenticate')
        .send(testRequestData)
        .expect(200);
      const { accessToken } = body;
      const claims = decode(accessToken);
      expect(claims?.sub).toEqual( alphaAccountApplicationTesco.application.id);
    });

    test('The returned access token claims should include the type', async () => {
      const { body } = await request(app)
        .post('/access/authenticate')
        .send(testRequestData)
        .expect(200);
      const { accessToken } = body;
      const claims = AccessToken.verify(accessToken);
      expect(claims.tokenType).toEqual('application');
    });
  });

  describe('Users', () => {
    describe('Email authentication' , () => {
      const testRequestData = {
        email: userTony.user.email,
        password: userTonyPassword,
      };

      test('I can exchange email and password for an access token', async () => {
        const { body } = await request(app)
          .post('/access/authenticate')
          .send(testRequestData)
          .expect(200);
        const { accessToken } = body;
        expect(accessToken).toBeDefined();
      });

      test('I can verify the returned access token was generated by the access service', async () => {
        const { body } = await request(app)
          .post('/access/authenticate')
          .send(testRequestData)
          .expect(200);
        const { accessToken } = body;
        AccessToken.verify(accessToken);
      });

      test('The access token should have userId for the token subject', async () => {
        const { body } = await request(app)
          .post('/access/authenticate')
          .send(testRequestData)
          .expect(200);
        const { accessToken } = body;
        const claims = decode(accessToken);
        expect(claims?.sub).toEqual(userTony.user.id);
      });

      test('The access token claims should have a token type of user', async () => {
        const { body } = await request(app)
          .post('/access/authenticate')
          .send(testRequestData)
          .expect(200);
        const { accessToken } = body;
        const claims = decode(accessToken);
        if (typeof claims === 'string') {
          throw new Error('wrong claims type');
        }
        expect(claims?.tokenType).toEqual('user');
      });
    });

    describe('Username authentication', () => {
      const testRequestData = {
        username: userTony.user.username,
        password: userTonyPassword,
      };

      test('I can exchange username and password for an access token', async () => {
        const { body } = await request(app)
          .post('/access/authenticate')
          .send(testRequestData)
          .expect(200);
        const { accessToken } = body;
        expect(accessToken).toBeDefined();
      });

      test('I can verify the returned access token was generated by the access service', async () => {
        const { body } = await request(app)
          .post('/access/authenticate')
          .send(testRequestData)
          .expect(200);
        const { accessToken } = body;
        AccessToken.verify(accessToken);
      });

      test('The access token should have userId for the token subject', async () => {
        const { body } = await request(app)
          .post('/access/authenticate')
          .send(testRequestData)
          .expect(200);
        const { accessToken } = body;
        const claims = decode(accessToken);
        expect(claims?.sub).toEqual(userTony.user.id);
      });

      test('The access token claims should have a token type of user', async () => {
        const { body } = await request(app)
          .post('/access/authenticate')
          .send(testRequestData)
          .expect(200);
        const { accessToken } = body;
        const claims = decode(accessToken);
        if (typeof claims === 'string') {
          throw new Error('wrong claims type');
        }
        expect(claims?.tokenType).toEqual('user');
      });
    });
  });
});
