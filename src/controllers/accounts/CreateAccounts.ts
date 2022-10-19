import Logger from 'bunyan';

import Accounts from '../../models/Accounts';
import Users from '../../models/Users';
import { components } from '../../../types/api';
import { ConflictError } from '../../errors';

export default class CreateAccounts {
  private readonly account: Accounts;

  private readonly user: Users;

  private readonly data: components['schemas']['AccountRequest'];

  constructor(data: components['schemas']['AccountRequest'], AccountsModel?: Accounts, UsersModel?: Users) {
    this.data = data;
    this.account = AccountsModel ?? new Accounts(this.data);
    this.user = UsersModel ?? new Users(this.data);
  }

  async exec(logger: Logger): Promise<{ account: Accounts; user: Users }> {
    const existingUser = await this.user.getByEmail(this.data.email);
    if (existingUser) {
      logger.info(`User ${this.data.email} already has an account`);
      throw new ConflictError(`User ${this.data.email} already has an account`);
    }
    const account = await this.account.create();
    const user = await this.user.create(this.data.password);
    return { account, user };
  }
}
