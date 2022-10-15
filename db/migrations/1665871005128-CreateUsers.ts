import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1665871005128 implements MigrationInterface {
    name = 'CreateUsers1665871005128'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            CREATE TABLE "access"."users" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "accountId" character varying,
                CONSTRAINT "REL_42bba679e348de51a699fb0a80" UNIQUE ("accountId"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
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
            DROP TABLE "access"."users"
        `);
    }

}
