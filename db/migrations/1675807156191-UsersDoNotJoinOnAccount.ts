import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersDoNotJoinOnAccount1675807156191 implements MigrationInterface {
  name = 'UsersDoNotJoinOnAccount1675807156191'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "access"."users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"
    `);
    await queryRunner.query(`
        ALTER TABLE "access"."users" DROP CONSTRAINT "REL_42bba679e348de51a699fb0a80"
    `);
    await queryRunner.query(`
        ALTER TABLE "access"."users" DROP COLUMN "accountId"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "access"."users"
            ADD "accountId" character varying
    `);
    await queryRunner.query(`
        ALTER TABLE "access"."users"
            ADD CONSTRAINT "REL_42bba679e348de51a699fb0a80" UNIQUE ("accountId")
    `);
    await queryRunner.query(`
        ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") REFERENCES "access"."accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

}
