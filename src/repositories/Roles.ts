import { Column, Entity, PrimaryColumn, JoinTable, ManyToOne, ManyToMany } from 'typeorm';

import AccountsRepository from './AccountsRepository';
import Users from './Users';
import Applications from './Applications';

@Entity()
export default class Roles {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => AccountsRepository, (account) => account.id)
  account!: AccountsRepository;

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
