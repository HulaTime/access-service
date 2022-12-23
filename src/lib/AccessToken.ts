import * as jwt from 'jsonwebtoken';

import { accessTokenPassphrase, accessTokenPrivateKey, accessTokenPublicKey } from '../../config/app.config';
import { AccessError } from '../errors';
import AccessTokenErrCodes from '../errors/errorCodes/accessTokenErrCodes';

export default class AccessToken {
  private _claims: Record<string, unknown> = {};

  constructor(claims?: Record<string, unknown>) {
    this._claims = { ...claims };
  }

  output(): string {
    return jwt.sign(this._claims, {
      key: accessTokenPrivateKey,
      passphrase: accessTokenPassphrase,
    }, { algorithm: 'ES512' });
  }

  static verify(token: string): jwt.JwtPayload {
    try {
      const result = jwt.verify(token, accessTokenPublicKey, { algorithms: ['ES512'] });
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
}
