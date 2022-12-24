import { Router } from 'express';
import { createLogger } from 'bunyan';
import { serializeError } from 'serialize-error';

import controllers from '../controllers/authenticate';
import { components } from '../../types/api';

const router: Router = Router();

const logger = createLogger({ name: 'asdf' });

router.post<
  Record<never, never>,
  components['schemas']['AuthenticateRes'],
  components['schemas']['AuthenticateUser'] | components['schemas']['AuthenticateApp'],
  Record<never, never>,
  Record<never, never>
>('/', async (req, res, next) => {
  try {
    const { body } = req;
    const controller = new controllers.Authenticate(body);
    const token = await controller.exec(logger);
    return res
      .status(200)
      .json({ accessToken: token.sign() });
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

export default router;


