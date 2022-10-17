import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import datasource from '../../db/app-datasource';
import UsersRepository from '../repositories/UsersRepository';

export type UserData = {
  email: string;
  username?: string;
  name?: string;
  description?: string;
}

export interface IUsers {
  id: string;
  email: string;
  username?: string;
  name?: string;
  description?: string;
}

export default class Users implements IUsers {
  private accountsRepository: Repository<UsersRepository>

  id: string

  email: string;

  username?: string;

  name?: string

  description?: string

  constructor(data: UserData, accountsRepository?: Repository<UsersRepository>) {
    this.id = uuid();
    this.email = data.email;
    this.name = data.name;
    this.description = data.description;
    this.accountsRepository = accountsRepository ?? datasource.getRepository(UsersRepository);
  }

  async create(password: string): Promise<Users> {
    await this.accountsRepository.insert({
      id: this.id,
      name: this.name,
      email: this.email,
      password: await argon2.hash(password)
    });
    return this;
  }
}
