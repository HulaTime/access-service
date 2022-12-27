import { RequestHandler } from 'express';

import AccessToken from '../lib/AccessToken';
import AuthenticateErrCodes from '../errors/errorCodes/authenticateErrorCodes';
import { AccessError } from '../errors';

const authMiddleware: RequestHandler = (req, res, next): void => {
  const { headers: { authorization } } = req;
  if (!authorization) {
    throw new AccessError(AuthenticateErrCodes.noAuthHeader);
  }
  const authClaims = AccessToken.verify(authorization);
  res.locals = { ...res.locals, authClaims };
  next();
};

export default authMiddleware;
