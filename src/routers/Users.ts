import { Router } from 'express';
import { createLogger } from 'bunyan';
import { serializeError } from 'serialize-error';

import controllers from '../controllers/users';
import { components } from '../../types/api';

const router: Router = Router();

const logger = createLogger({ name: 'asdf' });

router.post<
  Record<never, never>,
  components['schemas']['UserResponse'],
  components['schemas']['UserRequest'],
  Record<never, never>,
  Record<never, never>
>('/', async (req, res, next) => {
  try {
    const { body } = req;
    const controller = new controllers.CreateUser(body);
    const result = await controller.exec(logger);
    return res.status(201)
      .json(result);
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

export default router;


