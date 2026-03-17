import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773670800000 implements MigrationInterface {
    name = 'AutoMigration1773670800000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "nom" TO "lastName"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "prenom" TO "firstName"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "telephone" TO "phone"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "phone" TO "telephone"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "firstName" TO "prenom"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "lastName" TO "nom"`);
    }
}
