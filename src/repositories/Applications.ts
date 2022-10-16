import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import AccountsRepository from './AccountsRepository';

@Entity()
export default class Applications {
  @PrimaryColumn()
  id!: string

  @OneToOne(() => AccountsRepository)
  @JoinColumn()
  account!: AccountsRepository

  @Column()
  name!: string

  @Column()
  clientId!: string

  @Column()
  clientSecret!: string

  @Column()
  description?: string
}
