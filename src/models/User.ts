import { v4 as uuid } from 'uuid';

import Account from './Account';

export type UserData = {
  id: string;
  email: string;
  password: string;
  username?: string;
  description?: string;
}

export interface IUser {
  id: string;
  email: string;
  password: string;

  account: Account;
  username?: string;
  description?: string;
}

export default class User implements IUser {

  id: string;

  email: string;

  password: string;

  account: Account;

  username?: string;

  description?: string;

  constructor(data: UserData, account: Account) {
    this.id = data.id || uuid();
    this.email = data.email;
    this.password = data.password;
    this.username = data.username;
    this.description = data.description;
    this.account = account;
  }
}
