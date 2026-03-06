// This migration adds two new columns to the "users" table:
// - passwordResetTokenHash: A string field that stores the hashed token used for
//   password reset functionality.
// - passwordResetExpiresAt: A timestamp that indicates when the password reset token expires.

import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1772206565502 implements MigrationInterface {
    name = 'AutoMigration1772206565502'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetTokenHash" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetExpiresAt" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetExpiresAt"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetTokenHash"`);
    }

}
