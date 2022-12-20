import {
  Column, Entity, PrimaryColumn, JoinTable, ManyToOne, ManyToMany,
} from 'typeorm';

import AccountsEntity from './AccountsEntity';
import UsersEntity from './UsersEntity';
import ApplicationsEntity from './ApplicationsEntity';

@Entity()
export default class Roles {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @ManyToOne(() => AccountsEntity, (account) => account.id)
  account!: AccountsEntity;

  @ManyToMany(() => UsersEntity, { nullable: false })
  @JoinTable()
  users!: UsersEntity;

  @ManyToMany(() => ApplicationsEntity, { nullable: false })
  @JoinTable()
  applications!: ApplicationsEntity;

  @Column({ nullable: false })
  name!: string;
}
