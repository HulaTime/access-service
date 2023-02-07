import { IAccount } from './Account';
import { IUser } from './User';
import { IApplication } from './Application';

export interface IRole {
  id: string;
  name: string;
  account: IAccount;
  user?: IUser;
  application?: IApplication;
  description?: string;
}

export default class Role implements IRole{
  id: string;

  name: string;

  account: IAccount;

  user?: IUser;

  application?: IApplication;

  description?: string

  constructor(attributes: IRole) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.account = attributes.account;
    this.user = attributes.user;
    this.application = attributes.application;
    this.description = attributes.description;
  }
}
