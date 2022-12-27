import { MigrationInterface, QueryRunner } from 'typeorm';

export class OneToOneUsersToAccounts1672154028268 implements MigrationInterface {
    name = 'OneToOneUsersToAccounts1672154028268'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "UQ_42bba679e348de51a699fb0a803" UNIQUE ("accountId")
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "UQ_42bba679e348de51a699fb0a803"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
