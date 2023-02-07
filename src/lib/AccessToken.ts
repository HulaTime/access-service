import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { JwtPayload } from 'jsonwebtoken';

import { accessTokenPassphrase, accessTokenPrivateKey, accessTokenPublicKey } from '../../config/app.config';
import { AccessError } from '../errors';
import AccessTokenErrCodes from '../errors/errorCodes/accessTokenErrCodes';

export type AuthClaims = jwt.JwtPayload & { tokenType: 'application' | 'user' }

export default class AccessToken {
  tokenType: 'application' | 'user'

  private _claims: AuthClaims;

  constructor(type: 'application' | 'user', claims?: Record<string, unknown>) {
    this.tokenType = type;
    this._claims = { ...claims, tokenType: type };
  }

  private static isAuthClaims(claims: jwt.JwtPayload | AuthClaims): claims is AuthClaims {
    return !!claims.tokenType;
  }

  static decode(token: string): JwtPayload {
    const claims = jwt.decode(token);
    if (Array.isArray(claims) || typeof claims !== 'object' || claims === null) {
      throw new AccessError(AccessTokenErrCodes.invalidAccessToken);
    }
    return claims;
  }

  static verify(token: string, overridePublicKey?: string): AuthClaims {
    try {
      const claims = jwt.verify(
        token,
        overridePublicKey ?? accessTokenPublicKey,
        { algorithms: ['ES512'] },
      );
      if (typeof claims === 'string' || !AccessToken.isAuthClaims(claims)) {
        throw new AccessError(AccessTokenErrCodes.invalidTokenPayload);
      }
      return claims;
    } catch (err) {
      if (err instanceof jwt.JsonWebTokenError) {
        throw new AccessError(AccessTokenErrCodes.invalidAccessToken);
      }
      throw new AccessError(AccessTokenErrCodes.invalidAccessToken);
    }
  }

  sign(overrideKeys?: { privateKey: string; passphrase: string }): string {
    return jwt.sign(this._claims, {
      key: overrideKeys?.privateKey ?? accessTokenPrivateKey,
      passphrase: overrideKeys?.passphrase ?? accessTokenPassphrase,
    }, { algorithm: 'ES512', header: { kid: uuid(), alg: 'ES512' } });
  }
}
