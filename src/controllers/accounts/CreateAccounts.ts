import Logger from 'bunyan';
import { serializeError } from 'serialize-error';

import Accounts, { AccountData } from '../../models/Accounts';

export default class CreateAccounts {
  private accounts: Accounts;

  private data: AccountData;

  constructor(data: AccountData, AccountsModel?:Accounts) {
    this.data = data;
    this.accounts = AccountsModel ?? new Accounts(this.data);
  }

  async exec(logger: Logger): Promise<Accounts> {
    try {
      return await this.accounts.create();
    } catch (err) {
      logger.error({ error: serializeError(err) }, 'SHIT');
      throw err;
    }
  }
}
