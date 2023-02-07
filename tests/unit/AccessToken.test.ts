/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jwt from 'jsonwebtoken';

import AccessToken from '../../src/lib/AccessToken';
import { AccessError } from '../../src/errors';
import AccessTokenErrCodes from '../../src/errors/errorCodes/accessTokenErrCodes';
import KeyPair from '../../src/lib/KeyPair';

describe('AccessToken class', () => {
  test('It should exist', () => {
    expect(new AccessToken('user')).toBeInstanceOf(AccessToken);
  });

  test('I can specify it should be a user token', () => {
    const token = new AccessToken('user');
    expect(token.tokenType).toEqual('user');
  });

  test('I can specify it should be an application token', () => {
    const token = new AccessToken('application');
    expect(token.tokenType).toEqual('application');
  });

  describe('Token Claims', () => {
    test('A new access token can be instantiated with custom claims', () => {
      const accessToken = new AccessToken('user', {
        foo: 'bar',
        hello: 'world',
      });
      expect(accessToken.sign()).toBeDefined();
    });

    test('A signed token can be decoded', () => {
      const customClaims = { foo: 'bar', hello: 'world' };
      const accessToken = new AccessToken('application', customClaims);
      const signedToken = accessToken.sign();
      const decodedToken = AccessToken.decode(signedToken);
      expect(decodedToken).toMatchObject(customClaims);
    });
  });

  describe('Signing and Verification', () => {
    test('A new access token can be generated and should be a string', () =>{
      const accessToken = new AccessToken('user');
      expect(typeof accessToken.sign()).toEqual('string');
    });

    test('A new access token can be signed with override keys', () => {
      const accessToken = new AccessToken('user', {
        foo: 'bar',
        hello: 'world',
      });
      const keyPair = new KeyPair('passphrase');
      const signedToken = accessToken.sign({
        privateKey: keyPair.privateKey,
        passphrase: 'passphrase',
      });
      expect(signedToken).toBeDefined();
    });

    test('A new access token can be verified', () => {
      const accessToken = new AccessToken('user');
      const verifyResult = AccessToken.verify(accessToken.sign());
      expect(verifyResult).toMatchObject({});
      expect(verifyResult.iat).toEqual(expect.any(Number));
    });

    test('A new access token can be verified with overridden keys', () => {
      const customClaims = { foo: 'bar', hello: 'world' };
      const accessToken = new AccessToken('user', customClaims);
      const keyPair = new KeyPair('passphrase');
      const signedToken = accessToken.sign({
        privateKey: keyPair.privateKey,
        passphrase: 'passphrase',
      });
      expect(signedToken).toBeDefined();
      const result = AccessToken.verify(signedToken, keyPair.publicKey);
      expect(result).toEqual({
        ...customClaims,
        tokenType: 'user',
        iat: expect.any(Number),
      });
    });

    test('A token should have the token type in the signed claims', () => {
      const userToken = new AccessToken('user');
      const appToken = new AccessToken('application');
      const signedUserToken = userToken.sign();
      const signedAppToken = appToken.sign();
      expect(AccessToken.verify(signedUserToken).tokenType).toEqual('user');
      expect(AccessToken.verify(signedAppToken).tokenType).toEqual('application');
    });
  });

  describe('Errors', () => {
    test('An token generated elsewhere can be proved to be invalid', () => {
      const anotherToken = jwt.sign({},`-----BEGIN EC PRIVATE KEY-----
MIHcAgEBBEIAwljGYwv3PjjX7+upyGGxQPT589e+OGReXTm/ZH9AmG8mH0IagurX
5+d69rIdR/WT7H9+wAw3UjoUpcgDuGHfqTGgBwYFK4EEACOhgYkDgYYABAAGd+d/
uzsJIESnOZceFWIQPNZFdhMnhTbveczjQ9MX3CDlQm/5q+9xh+BjIjUw6JKCK2DT
2NSnoT/xqpqRgzSaXQHZr/RZH3yPxFskCeyXKTbLcySYo47qVMg/E9/p5+0V8cRZ
Yop1HNuuZ/tNx5QID4V3abt+7VT0vC4fC9g+AO74SQ==
-----END EC PRIVATE KEY-----
`, { algorithm: 'ES512' });
      try {
        AccessToken.verify(anotherToken);
        throw new Error('wrong err');
      } catch (err: any) {
        expect(err).toBeInstanceOf(AccessError);
        expect(err.errorCode).toEqual(AccessTokenErrCodes.invalidAccessToken);
      }
    });
  });
});
