import bodyParser from 'body-parser';
import express, { Express, ErrorRequestHandler } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';
import { parse as parseQs } from 'qs';

import routers from './routers';
import { queryStringDepth, serviceName } from './config';
import httpErrorMapper from './errors/httpErrorMapper';

const app: Express = express();

app.set('query parser', (value: string) => parseQs(value, { depth: queryStringDepth }));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(OpenApiValidator.middleware({
  apiSpec: `${__dirname}/../api.yaml`,
  validateRequests: true,
  validateResponses: false,
}));

app.use(`/${serviceName}/accounts`, routers.accounts);
app.use(`/${serviceName}/users`, routers.users);
app.use(`/${serviceName}/authenticate`, routers.authenticate);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  const httpError = httpErrorMapper(err);

  return res.status(httpError.statusCode)
    .json({ message: httpError.message, errors: httpError.errors });
};

app.use(errorMiddleware);

export default app;
