import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773047477277 implements MigrationInterface {
    name = 'AutoMigration1773047477277'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "role" character varying(20) NOT NULL DEFAULT 'user'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
    }

}
