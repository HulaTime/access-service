import * as argon2 from 'argon2';

import { IAccount } from './Account';

export interface IApplication {
  id: string;
  name: string;
  clientId: string;
  clientSecret?: string;
  account: IAccount;
  description?: string;
  setClientSecret: (secret: string) => Promise<void>;
}

type ApplicationData = Omit<IApplication, 'account' | 'setClientSecret'>

export default class Application implements IApplication{
  id: string;

  name: string;

  clientId: string;

  clientSecret?: string;

  account: IAccount;

  description?: string;

  constructor(attributes: ApplicationData, account: IAccount) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.clientId = attributes.clientId;
    this.clientSecret = attributes.clientSecret;
    this.description = attributes.description;
    this.account = account;
  }

  async setClientSecret(secret: string): Promise<void> {
    this.clientSecret = await argon2.hash(secret);
  }
}
