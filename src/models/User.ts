import * as argon2 from 'argon2';
import { v4 as uuid } from 'uuid';

import Account from './Account';

export type UserData = {
  id: string;
  email: string;
  passwordHash?: string;
  username?: string;
  description?: string;
}

export interface IUser {
  id: string;
  email: string;
  passwordHash?: string;

  account?: Account;
  username?: string;
  description?: string;
}

export default class User implements IUser {

  id: string;

  email: string;

  passwordHash?: string;

  account?: Account;

  username?: string;

  description?: string;

  constructor(data: UserData, account?: Account) {
    this.id = data.id || uuid();
    this.email = data.email;
    this.username = data.username;
    this.passwordHash = data.passwordHash;
    this.description = data.description;
    this.account = account;
  }

  async setPassword(password: string): Promise<void> {
    this.passwordHash = await argon2.hash(password);
  }
}
