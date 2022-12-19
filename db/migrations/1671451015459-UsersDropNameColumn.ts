import { MigrationInterface, QueryRunner } from 'typeorm';

export class UsersDropNameColumn1671451015459 implements MigrationInterface {
    name = 'UsersDropNameColumn1671451015459'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users" DROP COLUMN "name"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users"
            ADD "name" character varying
        `);
    }

}
