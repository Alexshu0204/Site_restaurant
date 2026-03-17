import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1773679200000 implements MigrationInterface {
    name = 'AutoMigration1773679200000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."event_requests_status_enum" AS ENUM('inquiry_received', 'quote_sent', 'awaiting_client_confirmation', 'confirmed', 'declined', 'cancelled')`);
        await queryRunner.query(`CREATE TABLE "event_requests" ("id" SERIAL NOT NULL, "eventDate" TIMESTAMP NOT NULL, "startTime" character varying(5) NOT NULL, "participants" integer NOT NULL, "spaceRequested" character varying(120) NOT NULL, "eventType" character varying(100) NOT NULL, "additionalNotes" text, "status" "public"."event_requests_status_enum" NOT NULL DEFAULT 'inquiry_received', "isProfessional" boolean NOT NULL DEFAULT false, "message" text, "contactLastName" character varying(100), "contactFirstName" character varying(100), "contactEmail" character varying(150), "contactPhone" character varying(30), "bookedOn" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer NOT NULL, CONSTRAINT "PK_5588ac0c6e746f7446f1f40ec2c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "event_requests" ADD CONSTRAINT "FK_6d0dbf7577c24f42d5f6ad6405d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_requests" DROP CONSTRAINT "FK_6d0dbf7577c24f42d5f6ad6405d"`);
        await queryRunner.query(`DROP TABLE "event_requests"`);
        await queryRunner.query(`DROP TYPE "public"."event_requests_status_enum"`);
    }
}
