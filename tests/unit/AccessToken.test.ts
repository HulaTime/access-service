/* eslint-disable @typescript-eslint/no-explicit-any */
import * as jwt from 'jsonwebtoken';

import AccessToken from '../../src/lib/AccessToken';
import { AccessError } from '../../src/errors';
import AccessTokenErrCodes from '../../src/errors/errorCodes/accessTokenErrCodes';

describe('AccessToken class', () => {
  test('It should exist', () => {
    expect(new AccessToken()).toBeInstanceOf(AccessToken);
  });

  it('A new access token is generated and accessible on the instantiated class', () =>{
    const accessToken = new AccessToken();
    expect(accessToken.output()).toBeDefined();
  });

  it('A new access token is generated and should be a string', () =>{
    const accessToken = new AccessToken();
    expect(typeof accessToken.output()).toEqual('string');
  });

  it('A new access token can be instantiated with custom claims', () => {
    const accessToken = new AccessToken({
      foo: 'bar',
      hello: 'world',
    });
    expect(accessToken.output()).toBeDefined();
  });

  it('A new access token can be verified', () => {
    const accessToken = new AccessToken();
    const verifyResult = AccessToken.verify(accessToken.output());
    expect(verifyResult).toMatchObject({});
    expect(verifyResult.iat).toEqual(expect.any(Number));
  });

  it('An token generated elsewhere can be proved to be invalid', () => {
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
