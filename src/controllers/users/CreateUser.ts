import Logger from 'bunyan';
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';

import AccountErrCodes from '../../errors/errorCodes/accountErrorCodes';
import appDatasource from '../../../db/app-datasource';
import { AccessError } from '../../errors';
import { components } from '../../../types/api';
import { UsersRepository } from '../../repositories';

export default class CreateAccounts {
  private readonly usersRepository: Repository<UsersRepository>;

  private readonly data: components['schemas']['UserRequest'];


  constructor(data: components['schemas']['UserRequest']) {
    this.data = data;
    this.usersRepository = appDatasource.getRepository(UsersRepository);
  }

  async exec(logger: Logger): Promise<components['schemas']['UserResponse']> {
    const existingUser = await this.usersRepository.findOneBy({ email: this.data.email });
    if (existingUser) {
      logger.info(`User ${this.data.email} already has an account`);
      throw new AccessError(AccountErrCodes.userAlreadyHasAccount);
    }

    const user = {
      id: uuid(),
      email: this.data.email,
      password: await argon2.hash(this.data.password),
      username: this.data.username,
    };
    await this.usersRepository.insert(user);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user;
    return userResponse;
  }
}
