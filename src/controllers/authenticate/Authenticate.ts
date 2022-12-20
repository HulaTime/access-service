import Logger from 'bunyan';
import { sign as signJwt } from 'jsonwebtoken';

import { components } from '../../../types/api';
import { ApplicationsEntity, UsersEntity } from '../../dbEntities';
import { AccessError } from '../../errors';
import AuthenticateErrCodes from '../../errors/errorCodes/authenticateErrorCodes';
import AuthService from '../../services/AuthService';
import datasource from '../../../db/app-datasource';

type AuthenticateApp = components['schemas']['AuthenticateApp']

const isAppAuthRequest = (data: components['schemas']['AuthenticateUser'] | components['schemas']['AuthenticateApp']):
  data is AuthenticateApp => !!(data as AuthenticateApp).clientId;

export default class Authenticate {
  private readonly data: components['schemas']['AuthenticateUser'] | components['schemas']['AuthenticateApp'];

  constructor(
    data: components['schemas']['AuthenticateUser'] | components['schemas']['AuthenticateApp'],
  ) {
    this.data = data;
  }


  async exec(logger: Logger): Promise<components['schemas']['AuthenticateRes']> {
    const authService = new AuthService(
      this.data, datasource.getRepository(ApplicationsEntity), datasource.getRepository(UsersEntity),
    );
    if (isAppAuthRequest(this.data)) {
      const application = await authService.getClientApplication();
      if (!application) {
        logger.error();
        throw new AccessError(AuthenticateErrCodes.applicationNotFound);
      }
      const isValid = await authService.verifyCredentials();
      if (!isValid) {
        throw new Error('Forbidden');
      }
      const accessToken = signJwt({ sub: application.id }, 'abc123');
      return { accessToken };
    }

    const user = await authService.getUser();
    if (!user) {
      logger.error();
      throw new AccessError(AuthenticateErrCodes.userNotFound);
    }
    const isValid = await authService.verifyCredentials();
    if (!isValid) {
      throw new Error('Forbidden');
    }
    const accessToken = signJwt({ sub: user.id }, 'abc123');
    return { accessToken };
  }
}
