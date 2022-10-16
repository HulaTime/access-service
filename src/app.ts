import qs from 'qs';
import bodyParser from 'body-parser';
import express, { Express } from 'express';

import { queryStringDepth, serviceName } from './config';
import routers from './routers';

const app: Express = express();

app.set('query parser', (value: string) => qs.parse(value, { depth: queryStringDepth }));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(`/${serviceName}/accounts`, routers.accounts);

export default app;

