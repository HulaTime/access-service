import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountOwnerColumnToUser1666350866615 implements MigrationInterface {
    name = 'AddAccountOwnerColumnToUser1666350866615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD "isAccountOwner" boolean NOT NULL DEFAULT true
        `);
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
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."users"
            ALTER COLUMN "accountId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."users" DROP COLUMN "isAccountOwner"
        `);
    }

}
