import AccountErrCodes from './errorCodes/accountErrorCodes';
import AuthenticateErrCodes from './errorCodes/authenticateErrorCodes';
import AccessTokenErrCodes from './errorCodes/accessTokenErrCodes';

type ErrorCodes = AccountErrCodes | AuthenticateErrCodes | AccessTokenErrCodes

export class AccessError extends Error {
  readonly errorCode: ErrorCodes;

  constructor(errorCode: ErrorCodes, message?: string) {
    super(message);
    this.errorCode = errorCode;
  }
}
