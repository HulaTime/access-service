import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersAccountIdNullable1671453093426 implements MigrationInterface {
    name = 'UsersAccountIdNullable1671453093426'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ALTER COLUMN "accountId" DROP NOT NULL
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") 
            REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ALTER COLUMN "accountId"
            SET NOT NULL
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId")
            REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
