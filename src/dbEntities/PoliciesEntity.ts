import {
  Column, Entity, PrimaryColumn, JoinColumn, ManyToOne,
} from 'typeorm';

import AccountsEntity from './AccountsEntity';
import RolesEntity from './RolesEntity';

@Entity()
export default class Policies {
  @PrimaryColumn({ nullable: false })
  id!: string;

  @ManyToOne(() => AccountsEntity, { nullable: false })
  @JoinColumn()
  account!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column({
    type: 'jsonb',
    array: false,
    nullable: false,
  })
  content!: Record<string, unknown>;

  @ManyToOne(
    () => RolesEntity,
    (role) => role.id,
    { nullable: true },
  )
  roles!: RolesEntity
}
