import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773065034464 implements MigrationInterface {
    name = 'AutoMigration1773065034464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "lastfailedloginat" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastfailedloginat"`);
    }

}
