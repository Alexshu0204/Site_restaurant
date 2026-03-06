// This migration creates a new table called "users" with the following columns:
// - id: A primary key that auto-increments for each new user.
// - email: A unique string field that stores the user's email address.
// - passwordHash: A string field that stores the hashed password of the user.
// - createdAt: A timestamp that records when the user was created, with a default
// value of the current time.

import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1771863397558 implements MigrationInterface {
    name = 'AutoMigration1771863397558'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying(150) NOT NULL, "passwordHash" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
