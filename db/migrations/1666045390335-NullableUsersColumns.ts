import { MigrationInterface, QueryRunner } from 'typeorm';

export class NullableUsersColumns1666045390335 implements MigrationInterface {
  name = 'NullableUsersColumns1666045390335';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "access"."users"
            ALTER COLUMN "name" DROP NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "access"."users"
            ALTER COLUMN "username" DROP NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE "access"."users"
            ALTER COLUMN "username"
                SET NOT NULL
    `);
    await queryRunner.query(`
        ALTER TABLE "access"."users"
            ALTER COLUMN "name"
                SET NOT NULL
    `);
  }

}
