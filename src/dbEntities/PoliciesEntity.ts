import {
  Column, Entity, PrimaryColumn, OneToOne, JoinColumn,
} from 'typeorm';

import AccountsEntity from './AccountsEntity';
import RolesRepository from './RolesEntity';

@Entity()
export default class Policies {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @OneToOne(() => AccountsEntity, { nullable: false })
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
