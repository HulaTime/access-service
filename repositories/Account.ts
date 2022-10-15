import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export default class Accounts {
  @PrimaryColumn()
  id!: string

  @Column()
  name!: string
}
