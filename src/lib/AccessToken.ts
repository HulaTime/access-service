import * as jwt from 'jsonwebtoken';

import { accessTokenPassphrase, accessTokenPrivateKey, accessTokenPublicKey } from '../../config/app.config';
import { AccessError } from '../errors';
import AccessTokenErrCodes from '../errors/errorCodes/accessTokenErrCodes';

export default class AccessToken {
  private _claims: Record<string, unknown> = {};

  constructor(claims?: Record<string, unknown>) {
    this._claims = { ...claims };
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
    }, { algorithm: 'ES512' });
  }
}
