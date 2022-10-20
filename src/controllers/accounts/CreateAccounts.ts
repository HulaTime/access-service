import Logger from 'bunyan';
import { v4 as uuid } from 'uuid';

import Users from '../../models/Users';
import { components } from '../../../types/api';
import { ConflictError } from '../../errors';
import appDatasource from '../../../db/app-datasource';
import { DataSource } from 'typeorm';
import { AccountsRepository } from '../../repositories';

export default class CreateAccounts {
  private readonly user: Users;

  private readonly data: components['schemas']['AccountRequest'];

  private dataSource: DataSource;

  constructor(data: components['schemas']['AccountRequest'], UsersModel?: Users) {
    this.data = data;
    this.dataSource = appDatasource;
    this.user = UsersModel ?? new Users(this.data);
  }

  async exec(logger: Logger): Promise<{ account: components['schemas']['AccountResponse']; user: Users }> {
    const existingUser = await this.user.getByEmail(this.data.email);
    if (existingUser) {
      logger.info(`User ${this.data.email} already has an account`);
      throw new ConflictError(`User ${this.data.email} already has an account`);
    }

    const account = {
      id: uuid(),
      name: this.data.name,
      description: this.data.description
    };
    await this.dataSource.getRepository(AccountsRepository).insert(account);
    const user = await this.user.create(this.data.password);
    return { account, user };
  }
}
