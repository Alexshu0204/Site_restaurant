import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773673200000 implements MigrationInterface {
    name = 'AutoMigration1773673200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "bookings" ("id" SERIAL NOT NULL, "reservationDate" TIMESTAMP NOT NULL, "bookedOn" TIMESTAMP NOT NULL DEFAULT now(), "guestsNumber" integer NOT NULL, "specialRequest" text, "isMarketable" boolean NOT NULL DEFAULT false, "status" character varying(30) NOT NULL DEFAULT 'pending', "userId" integer NOT NULL, CONSTRAINT "PK_64a21868f1d764f2e6f0ac2b778" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_6c2f74973d3e39f6f2ec8047f66" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_6c2f74973d3e39f6f2ec8047f66"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
    }
}
