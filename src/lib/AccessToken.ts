import * as jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

import { accessTokenPassphrase, accessTokenPrivateKey, accessTokenPublicKey } from '../../config/app.config';
import { AccessError } from '../errors';
import AccessTokenErrCodes from '../errors/errorCodes/accessTokenErrCodes';

export default class AccessToken {
  tokenType: 'application' | 'user'

  private _claims: Record<string, unknown> = {};

  constructor(type: 'application' | 'user', claims?: Record<string, unknown>) {
    this.tokenType = type;
    this._claims = { ...claims, tokenType: type };
  }

  static verify(token: string, overridePublicKey?: string): jwt.JwtPayload {
    try {
      const result = jwt.verify(
        token,
        overridePublicKey ?? accessTokenPublicKey,
        { algorithms: ['ES512'] },
      );
      if (typeof result === 'string') {
        throw new AccessError(AccessTokenErrCodes.invalidTokenPayload);
      }
      return result;
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
