import {
  Column, Entity, PrimaryColumn, JoinColumn, ManyToOne,
} from 'typeorm';

import AccountsEntity from './AccountsEntity';

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

  @ManyToOne(() => AccountsEntity, { nullable: true })
  @JoinColumn()
  account?: AccountsEntity;
}
