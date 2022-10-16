import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import datasource from '../../db/app-datasource';
import AccountsRepository from '../repositories/AccountsRepository';

export type AccountData = {
  name: string;
  description?: string;
}

export interface IAccounts {
  id: string;
  name: string;
  description?: string;
}

export default class Accounts implements IAccounts {
  private accountsRepository: Repository<AccountsRepository>

  id: string

  name: string

  description?: string

  constructor(data: AccountData, accountsRepository?: Repository<AccountsRepository>) {
    this.id = uuid();
    this.name = data.name;
    this.description = data.description;
    this.accountsRepository = accountsRepository ?? datasource.getRepository(AccountsRepository);
  }

  async create(): Promise<Accounts> {
    await this.accountsRepository.insert({
      id: this.id,
      name: this.name,
      description: this.description,
    });
    return this;
  }

}
