import { RequestHandler } from 'express';

import AccessToken from '../lib/AccessToken';
import AuthenticateErrCodes from '../errors/errorCodes/authenticateErrorCodes';
import { AccessError } from '../errors';

const authMiddleware: RequestHandler = (req, _res, next): void => {
  const { headers: { authorization } } = req;
  if (!authorization) {
    throw new AccessError(AuthenticateErrCodes.noAuthHeader);
  }
  AccessToken.verify(authorization);
  next();
};

export default authMiddleware;
