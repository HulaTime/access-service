import { BadRequest as OpenApiErrorBadReq } from 'express-openapi-validator/dist/framework/types';

import AccountErrCodes from './errorCodes/accountErrorCodes';
import AccessTokenErrCodes from './errorCodes/accessTokenErrCodes';
import AuthenticateErrCodes from './errorCodes/authenticateErrorCodes';
import UserErrCodes from './errorCodes/userErrorCodes';

import { AccessError } from './index';

export type HttpFailure = {
  statusCode: number;
  message?: string;
  errors?: unknown[];
}

const unexpectedErrorResponse = (msg?: string): HttpFailure => ({
  statusCode: 500,
  message: msg ?? 'Something unexpected has happened, a team is investigating what went wrong',
});

const conflictResponse = (message?: string): HttpFailure => ({ statusCode: 409, message });

const unauthorizedResponse = (message?: string): HttpFailure => ({ statusCode: 401, message });

const validationResponse = (err: OpenApiErrorBadReq): HttpFailure =>
  ({ statusCode: 400, message: 'Bad Request', errors: err.errors.map(e => ({ message: e.message, path: e.path })) });

const httpErrorMapper = (err: unknown): HttpFailure => {
  if (err instanceof OpenApiErrorBadReq) {
    return validationResponse(err);
  }

  if (!(err instanceof AccessError)) {
    return unexpectedErrorResponse();
  }

  switch (err.errorCode) {
    case AuthenticateErrCodes.noAuthHeader: {
      return unauthorizedResponse('No authorization header provided');
    }
    case AccessTokenErrCodes.invalidAccessToken: {
      return unauthorizedResponse('The supplied accessToken is not valid');
    }
    case AccountErrCodes.userDoesNotExist: {
      return unexpectedErrorResponse('An account already exists for email address provided');
    }
    case UserErrCodes.userAlreadyHasAccount: {
      return conflictResponse('A user with the supplied email address already exists');
    }
    case AccountErrCodes.userAlreadyHasAnAccount: {
      return conflictResponse('User already has an account');
    }
    case AccountErrCodes.applicationAccountDoesNotExist:
    case AccountErrCodes.userIsNotAssociatedWithAccount: {
      return conflictResponse('The account specified does not exist');
    }
    default: {
      return unexpectedErrorResponse();
    }
  }
};

export default httpErrorMapper;
