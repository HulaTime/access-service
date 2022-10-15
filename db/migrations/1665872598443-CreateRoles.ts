import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRoles1665872598443 implements MigrationInterface {
    name = 'CreateRoles1665872598443'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            CREATE TABLE "access"."roles" (
                "id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "username" character varying NOT NULL,
                "password" character varying NOT NULL,
                "accountId" character varying,
                CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id")
            )
        `);
      await queryRunner.query(`
            CREATE TABLE "access"."roles_users_users" (
                "rolesId" character varying NOT NULL,
                "usersId" character varying NOT NULL,
                CONSTRAINT "PK_d9b9cca39b8cc7e99072274dafa" PRIMARY KEY ("rolesId", "usersId")
            )
        `);
      await queryRunner.query(`
            CREATE INDEX "IDX_6baa1fce24dde516186c4f0269" ON "access"."roles_users_users" ("rolesId")
        `);
      await queryRunner.query(`
            CREATE INDEX "IDX_391282056f6da8665b38480a13" ON "access"."roles_users_users" ("usersId")
        `);
      await queryRunner.query(`
            CREATE TABLE "access"."roles_applications_applications" (
                "rolesId" character varying NOT NULL,
                "applicationsId" character varying NOT NULL,
                CONSTRAINT "PK_4cab6f11510e611c04db457ea42" PRIMARY KEY ("rolesId", "applicationsId")
            )
        `);
      await queryRunner.query(`
            CREATE INDEX "IDX_df637d70f591bb06bc6e3e56c3" ON "access"."roles_applications_applications" ("rolesId")
        `);
      await queryRunner.query(`
            CREATE INDEX "IDX_f1497af86a9cf348e038f228b8" ON "access"."roles_applications_applications" ("applicationsId")
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles"
            ADD CONSTRAINT "FK_ad30fbc5d40f522acf1d828cc13" FOREIGN KEY ("accountId") REFERENCES "access"."accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles_users_users"
            ADD CONSTRAINT "FK_6baa1fce24dde516186c4f0269a" FOREIGN KEY ("rolesId") REFERENCES "access"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles_users_users"
            ADD CONSTRAINT "FK_391282056f6da8665b38480a131" FOREIGN KEY ("usersId") REFERENCES "access"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles_applications_applications"
            ADD CONSTRAINT "FK_df637d70f591bb06bc6e3e56c3c" FOREIGN KEY ("rolesId") REFERENCES "access"."roles"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles_applications_applications"
            ADD CONSTRAINT "FK_f1497af86a9cf348e038f228b82" FOREIGN KEY ("applicationsId") REFERENCES "access"."applications"("id") ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."roles_applications_applications" DROP CONSTRAINT "FK_f1497af86a9cf348e038f228b82"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles_applications_applications" DROP CONSTRAINT "FK_df637d70f591bb06bc6e3e56c3c"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles_users_users" DROP CONSTRAINT "FK_391282056f6da8665b38480a131"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles_users_users" DROP CONSTRAINT "FK_6baa1fce24dde516186c4f0269a"
        `);
      await queryRunner.query(`
            ALTER TABLE "access"."roles" DROP CONSTRAINT "FK_ad30fbc5d40f522acf1d828cc13"
        `);
      await queryRunner.query(`
            DROP INDEX "access"."IDX_f1497af86a9cf348e038f228b8"
        `);
      await queryRunner.query(`
            DROP INDEX "access"."IDX_df637d70f591bb06bc6e3e56c3"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."roles_applications_applications"
        `);
      await queryRunner.query(`
            DROP INDEX "access"."IDX_391282056f6da8665b38480a13"
        `);
      await queryRunner.query(`
            DROP INDEX "access"."IDX_6baa1fce24dde516186c4f0269"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."roles_users_users"
        `);
      await queryRunner.query(`
            DROP TABLE "access"."roles"
        `);
    }

}
