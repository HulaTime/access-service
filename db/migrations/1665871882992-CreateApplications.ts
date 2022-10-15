import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateApplications1665871882992 implements MigrationInterface {
    name = 'CreateApplications1665871882992'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            CREATE TABLE "access"."applications" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "clientId" character varying NOT NULL,
                "clientSecret" character varying NOT NULL,
                "description" character varying NOT NULL,
                "accountId" character varying,
                CONSTRAINT "REL_b6f665ecce82e02e31f64198d6" UNIQUE ("accountId"),
                CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id")
            )
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ADD CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."applications" DROP CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."applications"
        `);
    }

}
