import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773667200000 implements MigrationInterface {
    name = 'AutoMigration1773667200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "nom" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "prenom" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "telephone" character varying(30)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "telephone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "prenom"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nom"`);
    }

}