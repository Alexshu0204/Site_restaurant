import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773230715179 implements MigrationInterface {
    name = 'AutoMigration1773230715179'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu_items" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" text, "price" integer NOT NULL, "imageUrl" character varying, "isAvailable" boolean NOT NULL DEFAULT true, "categoryId" integer, CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_d56e5ccc298e8bf721f75a7eb96" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_d56e5ccc298e8bf721f75a7eb96"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "menu_items"`);
    }

}
