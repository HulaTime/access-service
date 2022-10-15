import { Column, Entity, PrimaryColumn, JoinTable, ManyToOne, ManyToMany } from 'typeorm';

import Accounts from './Account';
import Users from './Users';
import Applications from './Applications';

@Entity()
export default class Roles {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => Accounts, (account) => account.id)
  account!: Accounts;

  @ManyToMany(() => Users)
  @JoinTable()
  users!: Users;

  @ManyToMany(() => Applications)
  @JoinTable()
  applications!: Applications;

  @Column()
  name!: string;

  @Column()
  username!: string;

  @Column()
  password!: string;
}
