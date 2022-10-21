import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import AccountsRepository from './AccountsRepository';

@Entity()
export default class Applications {
  @PrimaryColumn({ nullable: false })
  id!: string

  @OneToOne(() => AccountsRepository, { nullable: false })
  @JoinColumn()
  account!: AccountsRepository

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: false })
  clientId!: string

  @Column({ nullable: false })
  clientSecret!: string

  @Column({ nullable: true })
  description?: string
}
