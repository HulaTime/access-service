import {
  Column, Entity, PrimaryColumn, JoinColumn, ManyToOne, 
} from 'typeorm';

import AccountsRepository from './AccountsRepository';

@Entity()
export default class Users {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: true })
  username?: string;

  @ManyToOne(() => AccountsRepository, { nullable: true })
  @JoinColumn()
  account?: AccountsRepository;
}
