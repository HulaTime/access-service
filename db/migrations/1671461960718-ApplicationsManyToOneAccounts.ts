import { MigrationInterface, QueryRunner } from 'typeorm';

export class ApplicationsManyToOneAccounts1671461960718 implements MigrationInterface {
    name = 'ApplicationsManyToOneAccounts1671461960718'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."applications" DROP CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications" DROP CONSTRAINT "REL_b6f665ecce82e02e31f64198d6"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ADD CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d" FOREIGN KEY ("accountId")
            REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."applications" DROP CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ADD CONSTRAINT "REL_b6f665ecce82e02e31f64198d6" UNIQUE ("accountId")
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ADD CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d" FOREIGN KEY ("accountId")
            REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
