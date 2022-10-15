import 'reflect-metadata';
import express from 'express';
import { createLogger } from 'bunyan';

import { serializeError } from 'serialize-error';

const app = express();
const port = 3000;

const logger = createLogger({ name: 'access startup logger' });

const server = app.listen(port, async () => {
  try {
    logger.info(`Access app listening on port ${port}`);
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed to start up server');
    throw err;
  }
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close();
});
