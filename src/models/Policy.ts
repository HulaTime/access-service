import { IAccount } from './Account';
import { IRole } from './Role';

export type PolicyContent = Record<string, unknown>

export interface IPolicy {
  id: string;
  account: IAccount;
  content: PolicyContent;
  role: IRole;
  name?: string;
  description?: string;
}

export default class Policy implements IPolicy {
  id: string;

  account: IAccount;

  content: PolicyContent;

  role: IRole

  name?: string

  description?: string

  constructor(attributes: IPolicy) {
    this.id = attributes.id;
    this.account = attributes.account;
    this.content = attributes.content;
    this.role = attributes.role;
    this.name = attributes.name;
    this.description = attributes.description;
  }
}
