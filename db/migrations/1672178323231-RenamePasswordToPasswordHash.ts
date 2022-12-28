import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenamePasswordToPasswordHash1672178323231 implements MigrationInterface {
    name = 'RenamePasswordToPasswordHash1672178323231'

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users"
                RENAME COLUMN "password" TO "passwordHash"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query(`
            ALTER TABLE "access"."users"
                RENAME COLUMN "passwordHash" TO "password"
        `);
    }

}
