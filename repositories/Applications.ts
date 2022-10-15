import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import Accounts from './Account';

@Entity()
export default class Applications {
  @PrimaryColumn()
  id!: string

  @OneToOne(() => Accounts)
  @JoinColumn()
  account!: Accounts

  @Column()
  name!: string

  @Column()
  clientId!: string

  @Column()
  clientSecret!: string

  @Column()
  description?: string
}
