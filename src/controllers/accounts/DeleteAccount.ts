import Logger from 'bunyan';
import { DataSource } from 'typeorm';

import appDatasource from '../../../db/app-datasource';
import { AccountsEntity } from '../../dbEntities';
import { AccessError } from '../../errors';
import AccountErrCodes from '../../errors/errorCodes/accountErrorCodes';

export default class DeleteAccount {
  private readonly id: string;

  private readonly dataSource: DataSource;

  constructor(id: string, datasource?: DataSource) {
    this.id = id;
    this.dataSource = datasource ?? appDatasource;
  }

  async exec(logger: Logger): Promise<void> {
    const account = await this.dataSource.getRepository(AccountsEntity).delete({ id: this.id });
    if (!account) {
      throw new AccessError(AccountErrCodes.accountDoesNotExist);
    }
    logger.info('Success');
  }
}
