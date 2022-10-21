import { Column, Entity, PrimaryColumn, JoinTable, ManyToOne, ManyToMany } from 'typeorm';

import AccountsRepository from './AccountsRepository';
import Users from './UsersRepository';
import ApplicationsRepository from './ApplicationsRepository';

@Entity()
export default class Roles {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @ManyToOne(() => AccountsRepository, (account) => account.id)
  account!: AccountsRepository;

  @ManyToMany(() => Users, { nullable: false })
  @JoinTable()
  users!: Users;

  @ManyToMany(() => ApplicationsRepository, { nullable: false })
  @JoinTable()
  applications!: ApplicationsRepository;

  @Column({ nullable: false })
  name!: string;
}
