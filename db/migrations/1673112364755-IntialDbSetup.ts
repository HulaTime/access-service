import { MigrationInterface, QueryRunner } from 'typeorm';

export class IntialDbSetup1673112364755 implements MigrationInterface {
    name = 'IntialDbSetup1673112364755'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            CREATE TABLE "access"."accounts" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id")
            )
        `);
      await queryRunner.query(`
            CREATE TABLE "access"."applications" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "clientId" character varying NOT NULL,
                "clientSecretHash" character varying NOT NULL,
                "description" character varying,
                "accountId" character varying NOT NULL,
                "rolesId" character varying,
                CONSTRAINT "PK_938c0a27255637bde919591888f" PRIMARY KEY ("id")
            )
        `);
      await queryRunner.query(`
            CREATE TABLE "access"."policies" (
                "id" character varying NOT NULL,
                "name" character varying,
                "description" character varying,
                "content" jsonb NOT NULL,
                "accountId" character varying NOT NULL,
                "rolesId" character varying,
                CONSTRAINT "PK_603e09f183df0108d8695c57e28" PRIMARY KEY ("id")
            )
        `);
      await queryRunner.query(`
            CREATE TABLE "access"."roles" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "description" character varying,
                "accountId" character varying NOT NULL,
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);
      await queryRunner.query(`
            CREATE TABLE "access"."users" (
                "id" character varying NOT NULL,
                "email" character varying NOT NULL,
                "passwordHash" character varying NOT NULL,
                "username" character varying,
                "accountId" character varying,
                "rolesId" character varying,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "REL_42bba679e348de51a699fb0a80" UNIQUE ("accountId"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ADD CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications"
            ADD CONSTRAINT "FK_60aa83f8a7f5d0733075b29ce16" FOREIGN KEY ("rolesId") REFERENCES "access"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "FK_3d0209067b9ccc4c12f738b8db8" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies"
            ADD CONSTRAINT "FK_b61a5dd739a72bf9b969365ea94" FOREIGN KEY ("rolesId") REFERENCES "access"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles"
            ADD CONSTRAINT "FK_ad30fbc5d40f522acf1d828cc13" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_42bba679e348de51a699fb0a803" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD CONSTRAINT "FK_30cd0bbcd1dcae7673af7888eb8" FOREIGN KEY ("rolesId") REFERENCES "access"."roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "FK_30cd0bbcd1dcae7673af7888eb8"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."users" DROP CONSTRAINT "FK_42bba679e348de51a699fb0a803"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles" DROP CONSTRAINT "FK_ad30fbc5d40f522acf1d828cc13"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "FK_b61a5dd739a72bf9b969365ea94"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."policies" DROP CONSTRAINT "FK_3d0209067b9ccc4c12f738b8db8"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications" DROP CONSTRAINT "FK_60aa83f8a7f5d0733075b29ce16"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."applications" DROP CONSTRAINT "FK_b6f665ecce82e02e31f64198d6d"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."users"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."roles"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."policies"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."applications"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."accounts"
        `);
    }

}
