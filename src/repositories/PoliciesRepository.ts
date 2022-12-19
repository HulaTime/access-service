import {
  Column, Entity, PrimaryColumn, OneToOne, JoinColumn, 
} from 'typeorm';

import AccountsRepository from './AccountsRepository';
import RolesRepository from './RolesRepository';

@Entity()
export default class Policies {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @OneToOne(() => AccountsRepository, { nullable: false })
  @JoinColumn()
  account!: string;

  @OneToOne(() => RolesRepository, { nullable: false })
  @JoinColumn()
  role!: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
  })
  content!: Record<string, unknown>;
}
