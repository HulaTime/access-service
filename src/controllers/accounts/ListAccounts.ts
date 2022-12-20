import Logger from 'bunyan';
import { DataSource } from 'typeorm';

import appDatasource from '../../../db/app-datasource';
import { AccountsEntity } from '../../dbEntities';
import { components } from '../../../types/api';

export default class ListAccounts {
  private readonly dataSource: DataSource;

  constructor(datasource?: DataSource) {
    this.dataSource = datasource ?? appDatasource;
  }

  async exec(logger: Logger): Promise<components['schemas']['AccountResponse'][] > {
    const accounts = await this.dataSource.getRepository(AccountsEntity).find();
    logger.info('Success');
    return accounts;
  }
}
