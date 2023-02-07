import Logger from 'bunyan';
import { Repository } from 'typeorm';

import appDatasource from '../../../db/app-datasource';
import UserErrorCodes from '../../errors/errorCodes/userErrorCodes';
import { AccessError } from '../../errors';
import { components } from '../../../types/api';
import { UsersEntity } from '../../dbEntities';
import { AuthClaims } from '../../lib/AccessToken';

export default class GetUser {
  private readonly usersRepository: Repository<UsersEntity>;

  private readonly userId: string;

  private readonly logger: Logger;

  constructor(userId: string, logger: Logger) {
    this.userId = userId;
    this.logger = logger;
    this.logger.fields.userId = userId;
    this.usersRepository = appDatasource.getRepository(UsersEntity);
  }

  async exec(authClaims: AuthClaims): Promise<components['schemas']['UserResponse']> {
    const existingUser = await this.usersRepository.findOneBy({ id: this.userId });
    if (!existingUser) {
      this.logger.warn({ errorCode: UserErrorCodes.userDoesNotExist }, 'User does not exist');
      throw new AccessError(UserErrorCodes.userDoesNotExist);
    }

    if (existingUser.id !== authClaims.sub) {
      this.logger.warn({ errorCode: UserErrorCodes.userNotOwnedByCaller }, 'User does not exist');
      throw new AccessError(UserErrorCodes.userNotOwnedByCaller);
    }

    return existingUser;
  }
}
