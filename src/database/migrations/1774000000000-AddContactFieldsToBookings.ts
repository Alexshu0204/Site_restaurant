import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContactFieldsToBookings1774000000000 implements MigrationInterface {
  name = 'AddContactFieldsToBookings1774000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add columns for public booking contact information
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "firstName" character varying(100) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "lastName" character varying(100) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "email" character varying(150) NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "bookings" ADD "phone" character varying(30) NULL`
    );

    // Make userId nullable for public bookings
    await queryRunner.query(
      `ALTER TABLE "bookings" ALTER COLUMN "userId" DROP NOT NULL`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverse: make userId NOT NULL again
    await queryRunner.query(
      `ALTER TABLE "bookings" ALTER COLUMN "userId" SET NOT NULL`
    );

    // Drop the new columns
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "phone"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "firstName"`);
  }
}
