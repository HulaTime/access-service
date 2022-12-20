import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Accounts {
  @PrimaryColumn({ nullable: false })
  id!: string

  @Column({ nullable: false })
  name!: string

  @Column({ nullable: true })
  description?: string
}
