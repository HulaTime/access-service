import bodyParser from 'body-parser';
import { parse as parseQs } from 'qs';
import express, { Express } from 'express';

import routers from './routers';
import authMiddleware from './middlewares/authMiddleware';
import errorMiddleware from './middlewares/errorMiddleware';
import validationMiddleware from './middlewares/validationMiddleware';
import { queryStringDepth, serviceName } from './config';

const app: Express = express();

app.set('query parser', (value: string) => parseQs(value, { depth: queryStringDepth }));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(validationMiddleware);

app.use(`/${serviceName}/authenticate`, routers.authenticate);

app.use(authMiddleware);

app.use(`/${serviceName}/accounts`, routers.accounts);
app.use(`/${serviceName}/users`, routers.users);

app.use(errorMiddleware);

export default app;
