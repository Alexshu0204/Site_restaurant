import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoMigration1773752400000 implements MigrationInterface {
  name = 'AutoMigration1773752400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."contacts_status_enum" AS ENUM('new', 'in_progress', 'closed', 'spam')`,
    );
    await queryRunner.query(
      `CREATE TABLE "contacts" ("id" SERIAL NOT NULL, "fullName" character varying(120) NOT NULL, "email" character varying(150) NOT NULL, "phone" character varying(30), "subject" character varying(150) NOT NULL, "message" text NOT NULL, "status" "public"."contacts_status_enum" NOT NULL DEFAULT 'new', "adminNotes" text, "handledAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_66c77316b683e3c7269d929d3ac" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "contacts"`);
    await queryRunner.query(`DROP TYPE "public"."contacts_status_enum"`);
  }
}
