import { MigrationInterface, QueryRunner } from "typeorm";

export class DropAccountOwnerColFromUser1671237235631 implements MigrationInterface {
    name = 'DropAccountOwnerColFromUser1671237235631'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "access"."users" DROP COLUMN "isAccountOwner"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "REL_42bba679e348de51a699fb0a80"
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
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "REL_42bba679e348de51a699fb0a80" UNIQUE ("accountId")
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD "isAccountOwner" boolean NOT NULL DEFAULT true
        `);
    }

}
