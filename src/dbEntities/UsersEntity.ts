import {
  Column, Entity, PrimaryColumn, JoinColumn, OneToOne,
} from 'typeorm';

import AccountsEntity from './AccountsEntity';

@Entity()
export default class Users {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  passwordHash!: string;

  @Column({ nullable: true })
  username?: string;

  @OneToOne(() => AccountsEntity, { nullable: true })
  @JoinColumn()
  account?: AccountsEntity;
}
