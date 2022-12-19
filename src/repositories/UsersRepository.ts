import { Column, Entity, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';

import AccountsRepository from './AccountsRepository';

@Entity()
export default class Users {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @ManyToOne(() => AccountsRepository, { nullable: false })
  @JoinColumn()
  account!: AccountsRepository;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ nullable: false })
  password!: string;
}
