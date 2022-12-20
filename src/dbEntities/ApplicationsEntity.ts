import {
  Column, Entity, PrimaryColumn, JoinColumn, ManyToOne,
} from 'typeorm';

import AccountsEntity from './AccountsEntity';

@Entity()
export default class Applications {
  @PrimaryColumn({ nullable: false })
  id!: string

  @ManyToOne(() => AccountsEntity, { nullable: false })
  @JoinColumn()
  account!: AccountsEntity

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: false })
  clientId!: string

  @Column({ nullable: false })
  clientSecret!: string

  @Column({ nullable: true })
  description?: string
}
