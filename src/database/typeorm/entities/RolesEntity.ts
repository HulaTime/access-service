import {
  Column, Entity, PrimaryColumn, JoinTable, ManyToOne, OneToMany,
} from 'typeorm';

import AccountsEntity from './AccountsEntity';
import UsersEntity from './UsersEntity';
import ApplicationsEntity from './ApplicationsEntity';

import { PoliciesEntity } from './index';

@Entity()
export default class Roles {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => AccountsEntity, (account) => account.id, { nullable: false })
  account!: AccountsEntity;

  @OneToMany(() => UsersEntity, (user) => user.id,{ nullable: true })
  @JoinTable()
  users?: UsersEntity;

  @OneToMany(() => ApplicationsEntity, (application) => application.id, { nullable: true })
  @JoinTable()
  applications?: ApplicationsEntity;

  @OneToMany(() => PoliciesEntity, (policy) => policy.id, { nullable: false })
  policies!: PoliciesEntity
}
