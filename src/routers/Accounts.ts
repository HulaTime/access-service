import { Router } from 'express';

import { createLogger } from 'bunyan';

import controllers from '../controllers/accounts';
import { serializeError } from 'serialize-error';
import { components } from '../../types/api';

const router: Router = Router();

const logger = createLogger({ name: 'asdf' });

router.post<Record<never, never>,
  components['schemas']['AccountResponse'],
  components['schemas']['AccountRequest'],
  Record<never, never>,
  Record<never, never>>('/', async (req, res, next) => {
    try {
      const { body } = req;
      const controller = new controllers.CreateAccounts(body);
      const { account, user } = await controller.exec(logger);
      return res.status(201)
        .json({ id: account.id, name: account.name, description: account.description, email: user.email });
    } catch (err) {
      logger.error({ error: serializeError(err) }, 'Failed');
      return next(err);
    }
  });

export default router;

