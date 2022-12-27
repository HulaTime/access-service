import { IAccount } from './Account';

export interface IApplication {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  account: IAccount;
  description?: string;
}

export default class Application implements IApplication{
  id: string;

  name: string;

  clientId: string;

  clientSecret: string;

  account: IAccount;

  description?: string;

  constructor(attributes: Omit<IApplication, 'account'>, account: IAccount) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.clientId = attributes.clientId;
    this.clientSecret = attributes.clientSecret;
    this.description = attributes.description;
    this.account = account;
  }
}
