import { Router } from 'express';

import { createLogger } from 'bunyan';

import controllers from '../controllers/accounts';
import { serializeError } from 'serialize-error';
import { components, operations } from '../../types/api';

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

router.get<
  operations['GetAccount']['parameters']['path'],
  components['schemas']['AccountResponse'],
  Record<never, never>,
  Record<never, never>,
  Record<never, never>
>('/:id', async (req, res, next) => {
  try {
    const controller = new controllers.GetAccount(req.params.id);
    const account = await controller.exec(logger);
    return res.status(200).json(account);
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

router.post<
  operations['CreateAccountApplication']['parameters']['path'],
  components['schemas']['CreateAccountAppResponse'],
  components['schemas']['AccountAppRequest'],
  Record<never, never>,
  Record<never, never>
>('/:id/applications', async (req, res, next) => {
  try {
    const { body, params: { id: accountId } } = req;
    const controller = new controllers.CreateAccountApplications(accountId, body);
    const accountApp = await controller.exec(logger);
    return res.status(201).json(accountApp);
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

export default router;


