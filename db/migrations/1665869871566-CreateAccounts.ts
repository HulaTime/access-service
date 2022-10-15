import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAccounts1665869871566 implements MigrationInterface {
    name = 'CreateAccounts1665869871566'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            CREATE TABLE "access"."accounts" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            DROP TABLE "access"."accounts"
        `);
    }

}
