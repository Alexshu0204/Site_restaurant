import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1772795733527 implements MigrationInterface {
    name = 'AutoMigration1772795733527'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshtokenhash" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "refreshtokenexpiresat" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshtokenexpiresat"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "refreshtokenhash"`);
    }

}
