export interface IAccount {
  id: string;
  name: string;
  description?: string;
}

export default class Account implements IAccount{
  id: string;

  name: string;

  description?: string;

  constructor(attributes: IAccount) {
    this.id = attributes.id;
    this.name = attributes.name;
    this.description = attributes.description;
  }
}
