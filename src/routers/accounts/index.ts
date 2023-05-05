import { Router } from 'express';
import { createLogger } from 'bunyan';
import { serializeError } from 'serialize-error';

import controllers from '../../controllers/accounts';
import { components, operations } from '../../../types/api';
import { areNullValuesSupported } from '../../../config/app.config';
import { ResLocals, stripNullResponseValues } from '..';

const router: Router = Router();

const logger = createLogger({ name: 'asdf' });

router.post<
  Record<never, never>,
  components['schemas']['AccountRoleResponse'],
  components['schemas']['AccountRoleRequest'],
  Record<never, never>,
  ResLocals
>('/', async (req, res, next) => {
  try {
    const controller = new controllers.CreateAccounts(req.body, res.locals.authClaims);
    const account = await controller.exec(logger);
    return res
      .status(201)
      .json(stripNullResponseValues({
        id: account.id,
        name: account.name,
        description: account.description,
      }, areNullValuesSupported));
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

router.get<
  Record<never, never>,
  components['schemas']['ListAccountResponse'],
  Record<never, never>,
  Record<never, never>,
  Record<never, never>
>('/', async (_, res, next) => {
  try {
    const controller = new controllers.ListAccounts();
    const accounts = await controller.exec(logger);
    return res
      .status(200)
      .json(stripNullResponseValues(accounts, areNullValuesSupported));
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
    return res
      .status(200)
      .json(stripNullResponseValues(account, areNullValuesSupported));
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

export default router;
