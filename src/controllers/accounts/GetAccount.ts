import Logger from 'bunyan';
import { DataSource } from 'typeorm';

import appDatasource from '../../../db/app-datasource';
import { AccountsRepository } from '../../repositories';
import { components } from '../../../types/api';
import { ResourceNotFoundError } from '../../errors';

export default class GetAccount {
  private readonly id: string;

  private readonly dataSource: DataSource;

  constructor(id: string, datasource?: DataSource) {
    this.id = id;
    this.dataSource = datasource ?? appDatasource;
  }

  async exec(logger: Logger): Promise<components['schemas']['AccountResponse'] > {
    const account = await this.dataSource.getRepository(AccountsRepository).findOneBy({ id: this.id });
    if (!account) {
      throw new ResourceNotFoundError('d');
    }
    logger.info('Success');
    return account;
  }
}
