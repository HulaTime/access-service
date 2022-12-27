import AccountErrCodes from './errorCodes/accountErrorCodes';
import AuthenticateErrCodes from './errorCodes/authenticateErrorCodes';
import AccessTokenErrCodes from './errorCodes/accessTokenErrCodes';
import UserErrCodes from './errorCodes/userErrorCodes';

type ErrorCodes = AccountErrCodes
  | AuthenticateErrCodes
  | AccessTokenErrCodes
  | UserErrCodes

export class AccessError extends Error {
  readonly errorCode: ErrorCodes;

  constructor(errorCode: ErrorCodes, message?: string) {
    super(message);
    this.errorCode = errorCode;
  }
}
