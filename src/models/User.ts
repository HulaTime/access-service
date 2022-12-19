import { v4 as uuid } from 'uuid';

export type UserData = {
  id?: string;
  email: string;
  username?: string;
  name?: string;
  description?: string;
}

export interface IUser {
  id: string;
  email: string;
  username?: string;
  name?: string;
}

export default class User implements IUser {

  id: string;

  email: string;

  username?: string;

  name?: string;


  constructor(data: UserData) {
    this.id = data.id || uuid();
    this.email = data.email;
    this.name = data.name;
  }
}
