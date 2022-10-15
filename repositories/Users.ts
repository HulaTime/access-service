import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import Accounts from './Account';

@Entity()
export default class Users {
  @PrimaryColumn()
  id!: string

  @OneToOne(() => Accounts)
  @JoinColumn()
  account!: Accounts

  @Column()
  name!: string

  @Column()
  username!: string

  @Column()
  password!: string
}
