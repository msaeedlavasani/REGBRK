import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePropertiesTable1784711650922 implements MigrationInterface {
  name = 'CreatePropertiesTable1784711650922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."properties_type_enum" AS ENUM('SALE', 'RENT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."properties_status_enum" AS ENUM('ACTIVE', 'SOLD', 'RENTED')`,
    );
    await queryRunner.query(
      `CREATE TABLE "properties" ("id" uuid NOT NULL, "title" character varying NOT NULL, "address" character varying NOT NULL, "price" bigint NOT NULL, "type" "public"."properties_type_enum" NOT NULL, "area" double precision NOT NULL, "rooms_count" integer NOT NULL, "status" "public"."properties_status_enum" NOT NULL DEFAULT 'ACTIVE', "owner_id" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2d83bfa0b9fcd45dee1785af44d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "properties"`);
    await queryRunner.query(`DROP TYPE "public"."properties_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."properties_type_enum"`);
  }
}
