import { Column, Entity, OneToOne, PrimaryColumn, JoinColumn } from 'typeorm';

import AccountsRepository from './AccountsRepository';

@Entity()
export default class Users {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @OneToOne(() => AccountsRepository, { nullable: false })
  @JoinColumn()
  account!: AccountsRepository;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: false, default: true })
  isAccountOwner!: boolean;
}
