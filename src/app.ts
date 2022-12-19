import qs from 'qs';
import bodyParser from 'body-parser';
import express, { Express, ErrorRequestHandler } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';

import { queryStringDepth, serviceName } from './config';
import routers from './routers';
import { ConflictError } from './errors';

const app: Express = express();

app.set('query parser', (value: string) => qs.parse(value, { depth: queryStringDepth }));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(OpenApiValidator.middleware({
  apiSpec: `${__dirname}/../api.yaml`,
  validateRequests: true,
  validateResponses: false,
}));

app.use(`/${serviceName}/accounts`, routers.accounts);
app.use(`/${serviceName}/users`, routers.users);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ConflictError) {
    return res.status(409)
      .json({
        message: err.message,
      });
  }

  return res.status(err.status || 500)
    .json({
      message: err.message,
      errors: err.errors,
    });
};

app.use(errorMiddleware);

export default app;
