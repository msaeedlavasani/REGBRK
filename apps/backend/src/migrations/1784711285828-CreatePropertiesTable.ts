import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePropertiesTable1784711285828 implements MigrationInterface {
  name = 'CreatePropertiesTable1784711285828';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "owner_id"`);
    await queryRunner.query(
      `ALTER TABLE "properties" ADD "owner_id" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "properties" DROP COLUMN "owner_id"`);
    await queryRunner.query(
      `ALTER TABLE "properties" ADD "owner_id" uuid NOT NULL`,
    );
  }
}
