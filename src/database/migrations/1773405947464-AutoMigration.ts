import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773405947464 implements MigrationInterface {
    name = 'AutoMigration1773405947464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "price" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ALTER COLUMN "price" SET NOT NULL`);
    }

}
