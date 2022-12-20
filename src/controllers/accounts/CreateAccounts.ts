import Logger from 'bunyan';
import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';

import AccountErrCodes from '../../errors/errorCodes/accountErrorCodes';
import appDatasource from '../../../db/app-datasource';
import { components } from '../../../types/api';
import { AccessError } from '../../errors';
import { AccountsEntity, UsersEntity } from '../../dbEntities';

export default class CreateAccounts {
  private readonly accountsEntity: Repository<AccountsEntity>;

  private readonly usersRepository: Repository<UsersEntity>;

  private readonly data: components['schemas']['AccountRequest'];


  constructor(data: components['schemas']['AccountRequest']) {
    this.data = data;
    this.accountsEntity = appDatasource.getRepository(AccountsEntity);
    this.usersRepository = appDatasource.getRepository(UsersEntity);
  }

  async exec(logger: Logger): Promise<components['schemas']['CreateAccountResponse']> {
    const existingUser = await this.usersRepository.findOneBy({ email: this.data.email });
    if (existingUser) {
      logger.info(`User ${this.data.email} already has an account`);
      throw new AccessError(AccountErrCodes.userAlreadyHasAccount);
    }

    const account = {
      id: uuid(),
      name: this.data.name,
      description: this.data.description,
    };
    await this.accountsEntity.insert(account);
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
