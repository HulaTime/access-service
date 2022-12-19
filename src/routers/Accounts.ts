import { Router } from 'express';

import { createLogger } from 'bunyan';

import controllers from '../controllers/accounts';
import { serializeError } from 'serialize-error';
import { components } from '../../types/api';

const router: Router = Router();

const logger = createLogger({ name: 'asdf' });

router.post<Record<never, never>,
  components['schemas']['CreateAccountResponse'],
  components['schemas']['AccountRequest'],
  Record<never, never>,
  Record<never, never>>('/', async (req, res, next) => {
    try {
      const { body } = req;
      const controller = new controllers.CreateAccounts(body);
      const result = await controller.exec(logger);
      return res.status(201)
        .json(result);
    } catch (err) {
      logger.error({ error: serializeError(err) }, 'Failed');
      return next(err);
    }
  });

router.get<{ id: string },
  components['schemas']['AccountResponse'],
  Record<never, never>,
  Record<never, never>,
  Record<never, never>>('/:id', async (req, res, next) => {
    try {
      const controller = new controllers.GetAccount(req.params.id);
      const account = await controller.exec(logger);
      return res.status(200).json(account);
    } catch (err) {
      logger.error({ error: serializeError(err) }, 'Failed');
      return next(err);
    }
  });

export default router;


