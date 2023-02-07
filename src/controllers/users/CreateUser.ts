import Logger from 'bunyan';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';

import appDatasource from '../../../db/app-datasource';
import UserErrorCodes from '../../errors/errorCodes/userErrorCodes';
import { AccessError } from '../../errors';
import { components } from '../../../types/api';
import { UsersEntity } from '../../dbEntities';
import User from '../../models/User';

export default class CreateUser {
  private readonly usersRepository: Repository<UsersEntity>;

  private readonly data: components['schemas']['UserRequest'];

  private readonly logger: Logger;

  constructor(data: components['schemas']['UserRequest'], logger: Logger) {
    this.data = data;
    this.logger = logger;
    this.usersRepository = appDatasource.getRepository(UsersEntity);
  }

  async exec(): Promise<components['schemas']['UserResponse']> {
    const existingUser = await this.usersRepository.findOneBy({ email: this.data.email });
    if (existingUser) {
      this.logger.info(`User ${this.data.email} already has an account`);
      throw new AccessError(UserErrorCodes.userAlreadyExists);
    }

    const user = new User( {
      id: uuid(),
      email: this.data.email,
      username: this.data.username,
    });
    await user.setPassword(this.data.password);
    await this.usersRepository.insert(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userResponse } = user;
    return userResponse;
  }
}
