import { ErrorRequestHandler } from 'express';

import httpErrorMapper from '../errors/httpErrorMapper';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const httpError = httpErrorMapper(err);

  return res.status(httpError.statusCode)
    .json({ message: httpError.message, path: httpError.path, errors: httpError.errors });
};

export default errorMiddleware;
