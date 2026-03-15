import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773572994129 implements MigrationInterface {
    name = 'AutoMigration1773572994129'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "name" TYPE character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "name" TYPE character varying(50)`);
    }

}
