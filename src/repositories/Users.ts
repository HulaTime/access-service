import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import AccountsRepository from './AccountsRepository';

@Entity()
export default class Users {
  @PrimaryColumn()
  id!: string

  @OneToOne(() => AccountsRepository)
  @JoinColumn()
  account!: AccountsRepository

  @Column()
  name!: string

  @Column()
  username!: string

  @Column()
  password!: string
}
