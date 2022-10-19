import 'reflect-metadata';
import { serializeError } from 'serialize-error';
import { createLogger } from 'bunyan';

import app from './app';
import datasource from '../db/app-datasource';
import * as http from 'http';

const port = 3000;

const logger = createLogger({ name: 'access startup logger' });

let server: http.Server;

datasource.initialize().then(() => {
  server = app.listen(port, async () => {
    try {
      logger.info(`Access app listening on port ${port}`);
    } catch (err) {
      logger.error({ error: serializeError(err) }, 'Failed to start up server');
      throw err;
    }
  });
});

process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  await datasource.destroy();
  server && server.close();
});
