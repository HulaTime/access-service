import { serializeError } from 'serialize-error';
import { createLogger } from 'bunyan';

import { components, operations } from '../../../types/api';
import { ResLocals, stripNullResponseValues } from '../index';
import controllers from '../../controllers/accounts';

import router from './index';

const logger = createLogger({ name: 'asdf' });

router.post<
  operations['CreateAccountApplication']['parameters']['path'],
  components['schemas']['CreateAccountAppResponse'],
  components['schemas']['AccountAppRequest'],
  Record<never, never>,
  ResLocals
>('/:id/applications', async (req, res, next) => {
  try {
    const { body, params: { id: accountId } } = req;
    const { authClaims } = res.locals;
    const controller = new controllers.CreateAccountApplications(accountId, body, authClaims);
    const { application, clientSecret } = await controller.exec(logger);
    return res
      .status(201)
      .json(stripNullResponseValues({
        id: application.id,
        clientId: application.clientId,
        clientSecret: clientSecret,
        name: application.name,
        accountId: application.account.id,
        description: application.description,
      }));
  } catch (err) {
    logger.error({ error: serializeError(err) }, 'Failed');
    return next(err);
  }
});

export default router;
