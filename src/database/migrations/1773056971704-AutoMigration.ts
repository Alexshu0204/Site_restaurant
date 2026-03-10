import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773056971704 implements MigrationInterface {
    name = 'AutoMigration1773056971704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "security_events" ("id" SERIAL NOT NULL, "type" character varying(80) NOT NULL, "email" character varying(255), "outcome" character varying(80), "metadata" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6fc100d6700780737348df0d3ae" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "failedloginattempts" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "loginlockeduntil" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "loginlockeduntil"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "failedloginattempts"`);
        await queryRunner.query(`DROP TABLE "security_events"`);
    }

}
