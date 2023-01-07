import {
  Column, Entity, PrimaryColumn, JoinColumn, ManyToOne,
} from 'typeorm';

import AccountsEntity from './AccountsEntity';
import RolesEntity from './RolesEntity';

@Entity()
export default class Applications {
  @PrimaryColumn({ nullable: false })
  id!: string

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: false })
  clientId!: string

  @Column({ nullable: false })
  clientSecretHash!: string

  @Column({ nullable: true })
  description?: string

  @ManyToOne(() => AccountsEntity, { nullable: false })
  @JoinColumn()
  account!: AccountsEntity

  @ManyToOne(() => RolesEntity, (role) => role.id, { nullable: true })
  roles?: RolesEntity
}
