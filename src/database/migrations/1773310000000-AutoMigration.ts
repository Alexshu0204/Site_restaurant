import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773310000000 implements MigrationInterface {
    name = 'AutoMigration1773310000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "name" TYPE character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "name" TYPE character varying(100)`);
    }
}
