import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePoliciesTableFixNullableColumnsOnOtherTables1666350615985 implements MigrationInterface {
    name = 'CreatePoliciesTableFixNullableColumnsOnOtherTables1666350615985'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "access"."policies" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "content" jsonb NOT NULL,
                "accountId" character varying NOT NULL,
                "roleId" character varying NOT NULL,
                CONSTRAINT "REL_3d0209067b9ccc4c12f738b8db" UNIQUE ("accountId"),
                CONSTRAINT "REL_f86467860a0ec1d2a82ad3a381" UNIQUE ("roleId"),
                CONSTRAINT "PK_603e09f183df0108d8695c57e28" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."roles" DROP COLUMN "username"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."roles" DROP COLUMN "password"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."applications" DROP CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ALTER COLUMN "description" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ALTER COLUMN "accountId"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ADD CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "FK_3d0209067b9ccc4c12f738b8db8" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "FK_f86467860a0ec1d2a82ad3a381f" FOREIGN KEY ("roleId") REFERENCES "access"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "FK_f86467860a0ec1d2a82ad3a381f"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "FK_3d0209067b9ccc4c12f738b8db8"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."applications" DROP CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d"
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ALTER COLUMN "accountId" DROP NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ALTER COLUMN "description"
            SET NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ADD CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."roles"
            ADD "password" character varying NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "access"."roles"
            ADD "username" character varying NOT NULL
        `);
        await queryRunner.query(`
            DROP TABLE "access"."policies"
        `);
    }

}
