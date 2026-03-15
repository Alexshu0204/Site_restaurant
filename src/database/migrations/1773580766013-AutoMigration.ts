import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773580766013 implements MigrationInterface {
    name = 'AutoMigration1773580766013'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "priceTresGourmand" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "priceTresGourmand"`);
    }

}
