import Logger from 'bunyan';
import { v4 as uuid } from 'uuid';

// import User from '../../models/User';
import { components } from '../../../types/api';
import { ConflictError } from '../../errors';
import appDatasource from '../../../db/app-datasource';
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

  async exec(logger: Logger): Promise<{ account: components['schemas']['AccountResponse']; user: { } }> {
    const existingUser = await this.usersRepository.findOneBy({ email: this.data.email });
    if (existingUser) {
      logger.info(`User ${this.data.email} already has an account`);
      throw new ConflictError(`User ${this.data.email} already has an account`);
    }

    const account = {
      id: uuid(),
      name: this.data.name,
      description: this.data.description
    };
    const result = await this.accountsRepository.insert(account);
    console.log('-> result', result);
    // const user = await this.user.create(this.data.password);
    return { account, user: {} };
  }
}
