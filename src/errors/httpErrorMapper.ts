import { BadRequest as OpenApiErrorBadReq } from 'express-openapi-validator/dist/framework/types';

import AccountErrCodes from './errorCodes/accountErrorCodes';
import AccessTokenErrCodes from './errorCodes/accessTokenErrCodes';
import AuthenticateErrCodes from './errorCodes/authenticateErrorCodes';

import { AccessError } from './index';

export type HttpFailure = {
  statusCode: number;
  message?: string;
  errors?: unknown[];
}

const unexpectedErrorResponse = { statusCode: 500, message: 'Something unexpected has happened, a team is investigating what went wrong' };

const conflictResponse = (message?: string): HttpFailure => ({ statusCode: 409, message });

const unauthorizedResponse = (message?: string): HttpFailure => ({ statusCode: 401, message });

const validationResponse = (err: OpenApiErrorBadReq): HttpFailure =>
  ({ statusCode: 400, message: err.message, errors: err.errors });

const httpErrorMapper = (err: unknown): HttpFailure => {
  if (err instanceof OpenApiErrorBadReq) {
    return validationResponse(err);
  }

  if (!(err instanceof AccessError)) {
    return unexpectedErrorResponse;
  }

  switch (err.errorCode) {
    case AccountErrCodes.userAlreadyHasAccount: {
      return conflictResponse('An account already exists for email address provided');
    }
    case AuthenticateErrCodes.noAuthHeader:
    case AccessTokenErrCodes.invalidAccessToken: {
      return unauthorizedResponse('The supplied accessToken is not valid');
    }
    default: {
      return unexpectedErrorResponse;
    }
  }
};

export default httpErrorMapper;
