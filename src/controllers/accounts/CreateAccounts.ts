import Logger from 'bunyan';
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';

import appDatasource from '../../../db/app-datasource';
import { components } from '../../../types/api';
import { ConflictError } from '../../errors';
import { Repository } from 'typeorm';
import { AccountsRepository, UsersRepository } from '../../repositories';

export default class CreateAccounts {
  private readonly accountsRepository: Repository<AccountsRepository>;

  private readonly usersRepository: Repository<UsersRepository>;

  private readonly data: components['schemas']['AccountRequest'];


  constructor(data: components['schemas']['AccountRequest']) {
    this.data = data;
    this.accountsRepository = appDatasource.getRepository(AccountsRepository);
    this.usersRepository = appDatasource.getRepository(UsersRepository);
  }

  async exec(logger: Logger): Promise<components['schemas']['CreateAccountResponse']> {
    const existingUser = await this.usersRepository.findOneBy({ email: this.data.email });
    if (existingUser) {
      logger.info(`User ${this.data.email} already has an account`);
      throw new ConflictError(`User ${this.data.email} already has an account`);
    }

    const account = {
      id: uuid(),
      name: this.data.name,
      description: this.data.description,
    };
    await this.accountsRepository.insert(account);
    const user = {
      id: uuid(),
      email: this.data.email,
      password: await argon2.hash(this.data.password),
      account: { id: account.id },
    };
    await this.usersRepository.insert(user);
    return {
      id: account.id,
      name: account.name,
      description: account.description,
      email: user.email,
    };
  }
}
