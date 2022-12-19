import {
  Column, Entity, PrimaryColumn, JoinColumn, ManyToOne,
} from 'typeorm';

import AccountsRepository from './AccountsRepository';

@Entity()
export default class Applications {
  @PrimaryColumn({ nullable: false })
  id!: string

  @ManyToOne(() => AccountsRepository, { nullable: false })
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
