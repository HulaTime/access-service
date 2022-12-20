import AccountErrCodes from './errorCodes/accountErrorCodes';
import AuthenticateErrCodes from './errorCodes/authenticateErrorCodes';

type ErrorCodes = AccountErrCodes | AuthenticateErrCodes

export class AccessError extends Error {
  readonly errorCode: ErrorCodes;

  constructor(errorCode: ErrorCodes, message?: string) {
    super(message);
    this.errorCode = errorCode;
  }
}
