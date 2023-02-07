import {
  Column, Entity, PrimaryColumn, ManyToOne,
} from 'typeorm';

import RolesEntity from './RolesEntity';

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

  @ManyToOne(() => RolesEntity, (role) => role.id, { nullable: true })
  roles?: RolesEntity
}
