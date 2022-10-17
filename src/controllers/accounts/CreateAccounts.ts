import Logger from 'bunyan';
import { serializeError } from 'serialize-error';

import Accounts from '../../models/Accounts';
import Users from '../../models/Users';
import { components } from '../../../types/api';

export default class CreateAccounts {
  private accounts: Accounts;

  private users: Users;

    private readonly data: components['schemas']['AccountRequest'];

    constructor(data: components['schemas']['AccountRequest'], AccountsModel?:Accounts, UsersModel?:Users) {
      this.data = data;
      this.accounts = AccountsModel ?? new Accounts(this.data);
      this.users = UsersModel ?? new Users(this.data);
    }

    async exec(logger: Logger): Promise<{ account: Accounts; user: Users }> {
      try {
        const account = await this.accounts.create();
        const user = await this.users.create(this.data.password);
        return { account, user };
      } catch (err) {
        logger.error({ error: serializeError(err) }, 'SHIT');
        throw err;
      }
    }
}
