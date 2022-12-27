import { MigrationInterface, QueryRunner } from 'typeorm';

export class ReducePolicyToMostBasicFields1672171270790 implements MigrationInterface {
    name = 'ReducePolicyToMostBasicFields1672171270790'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "FK_f86467860a0ec1d2a82ad3a381f"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "REL_f86467860a0ec1d2a82ad3a381"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP COLUMN "roleId"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "FK_3d0209067b9ccc4c12f738b8db8"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ALTER COLUMN "name" DROP NOT NULL
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "REL_3d0209067b9ccc4c12f738b8db"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "FK_3d0209067b9ccc4c12f738b8db8" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "FK_3d0209067b9ccc4c12f738b8db8"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "REL_3d0209067b9ccc4c12f738b8db" UNIQUE ("accountId")
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ALTER COLUMN "name"
            SET NOT NULL
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "FK_3d0209067b9ccc4c12f738b8db8" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD "roleId" character varying NOT NULL
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "REL_f86467860a0ec1d2a82ad3a381" UNIQUE ("roleId")
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "FK_f86467860a0ec1d2a82ad3a381f" FOREIGN KEY ("roleId") REFERENCES "access"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}
