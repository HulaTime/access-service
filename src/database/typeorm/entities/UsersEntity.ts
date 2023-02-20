import {
  Column, Entity, PrimaryColumn, ManyToOne, OneToOne, JoinColumn,
} from 'typeorm';

import RolesEntity from './RolesEntity';

import { AccountsEntity } from './index';

@Entity()
export default class Users {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @OneToOne(() => AccountsEntity, { nullable: false })
  @JoinColumn()
  account!: string

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  passwordHash!: string;

  @Column({ nullable: true })
  username?: string;

  @ManyToOne(() => RolesEntity, (role) => role.id, { nullable: true })
  roles?: RolesEntity
}
