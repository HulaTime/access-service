import * as argon2 from 'argon2';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import datasource from '../../db/app-datasource';
import UsersRepository from '../repositories/UsersRepository';
import { createLogger } from 'bunyan';
import { serializeError } from 'serialize-error';
import { errorCodes, isDbError } from '../../db/dbErrors';
import { ConflictError } from '../errors';

export type UserData = {
  id?: string;
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
}

export default class Users implements IUsers {
  private logger = createLogger({ name: 'default users model logger' });

  private usersRepository: Repository<UsersRepository>;

  id: string;

  email: string;

  username?: string;

  name?: string;


  constructor(data: UserData, usersRepository?: Repository<UsersRepository>) {
    this.id = data.id || uuid();
    this.email = data.email;
    this.name = data.name;
    this.usersRepository = usersRepository ?? datasource.getRepository(UsersRepository);
  }

  async create(password: string): Promise<Users> {
    try {
      await this.usersRepository.insert({
        id: this.id,
        name: this.name,
        email: this.email,
        password: await argon2.hash(password)
      });
      return this;
    } catch (err) {
      this.logger.warn({ error: serializeError(err) }, 'Failed to create new User');
      if (isDbError(err)) {
        if (err.driverError.code === errorCodes.UniqueViolation) {
          throw new ConflictError(err.driverError.detail);
        }
      }
      throw err;
    }
  }

  async getByEmail(emailAddress: string): Promise<Users | false> {
    try {
      const userRecord = await this.usersRepository.findOneBy({ email: emailAddress });
      if (!userRecord) {
        this.logger.warn(`Could not find user with email ${emailAddress}`);
        return false;
      }
      return new Users({
        id: userRecord.id,
        name: userRecord.name,
        email: userRecord.email,
        username: userRecord.username,
      });
    } catch (err) {
      this.logger.error({ error: serializeError(err) }, 'Failed to get user by email address');
      throw err;
    }
  }
}
