import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import AccountsRepository from './AccountsRepository';

@Entity()
export default class Users {
  @PrimaryColumn()
  id!: string

  @OneToOne(() => AccountsRepository)
  @JoinColumn()
  account!: AccountsRepository

  @Column({ unique: true })
  email!: string

  @Column({ nullable: true })
  name?: string

  @Column({ nullable: true })
  username?: string

  @Column()
  password!: string
}
