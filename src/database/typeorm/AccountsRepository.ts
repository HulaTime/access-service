import { Repository } from 'typeorm';
import Logger from 'bunyan';

import Database, { DBWhere } from '../../interfaces/Database';
import getInitializedDatasource from '../../../db/app-datasource';
import { IAccount } from '../../models/Account';

import { AccountsEntity } from './entities';

export default class AccountsRepository implements Database<IAccount> {
  private repository?: Repository<AccountsEntity>;

  private logger: Logger;

  constructor(logger: Logger) {
    this.logger=logger;
  }

  private async getRepository(): Promise<Repository<AccountsEntity>> {
    if (!this.repository) {
      const datasource = await getInitializedDatasource();
      this.repository = datasource.getRepository(AccountsEntity);
    }
    return this.repository;
  }

  async insert(account: IAccount): Promise<void> {
    try {
      const repo = await this.getRepository();
      await repo.insert(account);
    } catch (err) {
      this.logger.error();
      throw err;
    }
  }

  async get(id: string): Promise<IAccount> {
    try {
      const repo = await this.getRepository();
      const account = await repo.findOneBy({ id });
      if (account) {
        return account;
      }
      throw new Error('not found');
    } catch (err) {
      this.logger.error();
      throw err;
    }
  }

  async update(accountId: string, account: Partial<IAccount>): Promise<IAccount> {
    try {
      const repo = await this.getRepository();
      const result = await repo.createQueryBuilder()
        .update(AccountsEntity, account)
        .where('id = :id', { id: accountId })
        .returning('*')
        .updateEntity(true)
        .execute();
      return result.raw;
    } catch (err) {
      this.logger.error();
      throw err;
    }
  }

  async delete(where: DBWhere): Promise<void> {
    try {
      const repo = await this.getRepository();
      await repo.delete(where);
    } catch (err) {
      this.logger.error();
      throw err;
    }
  }
}
