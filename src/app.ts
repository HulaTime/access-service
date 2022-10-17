import qs from 'qs';
import bodyParser from 'body-parser';
import express, { Express, ErrorRequestHandler } from 'express';
import * as OpenApiValidator from 'express-openapi-validator';

import { queryStringDepth, serviceName } from './config';
import routers from './routers';

const app: Express = express();

app.set('query parser', (value: string) => qs.parse(value, { depth: queryStringDepth }));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(OpenApiValidator.middleware({
  apiSpec: `${__dirname}/../api.yaml`,
  validateRequests: true,
  validateResponses: true,
}));

app.use(`/${serviceName}/accounts`, routers.accounts);

const errorMiddleware: ErrorRequestHandler = (err, _, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
  next();
};

app.use(errorMiddleware);

export default app;