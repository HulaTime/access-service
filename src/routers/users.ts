
import { Router } from 'express';
import { createLogger } from 'bunyan';
import { serializeError } from 'serialize-error';

import controllers from '../controllers/users';
import { components } from '../../types/api';
import { AuthClaims } from '../lib/AccessToken';

const publicRouter: Router = Router();

const privateRouter: Router = Router();

publicRouter.post<
  Record<never, never>,
  components['schemas']['UserResponse'],
  components['schemas']['UserRequest'],
  Record<never, never>,
  Record<never, never>
>('/', async (req, res, next) => {
  const logger = createLogger({ name: 'create-user-logger' });
  try {
    const { body } = req;
    const controller = new controllers.CreateUser(body, logger);
    const result = await controller.exec();
    return res.status(201)
      .json(result);
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

privateRouter.get<
  { id: string },
  components['schemas']['UserResponse'],
  void,
  void,
  { authClaims: AuthClaims }
>('/:id', async (req, res, next) => {
  const logger = createLogger({ name: 'get-user-logger' });
  try {
    const { params: { id } } = req;
    const { locals: { authClaims } } = res;
    logger.fields.authClaims = authClaims;
    const controller = new controllers.GetUser(id, logger);
    const result = await controller.exec(authClaims);
    return res.status(200)
      .json(result);
  }catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

export default { publicRouter, privateRouter };


