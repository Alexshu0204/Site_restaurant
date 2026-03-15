import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773397634328 implements MigrationInterface {
    name = 'AutoMigration1773397634328'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "priceGourmand" integer`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "imageUrl" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "imageUrl"`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "imageUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "priceGourmand"`);
    }

}
