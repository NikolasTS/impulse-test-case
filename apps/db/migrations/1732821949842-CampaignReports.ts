import { MigrationInterface, QueryRunner } from 'typeorm';

export class CampaignReports1732821949842 implements MigrationInterface {
  name = 'CampaignReports1732821949842';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "campaign_reports" ("campaign" character varying NOT NULL, "campaign_id" character varying NOT NULL, "adgroup" character varying NOT NULL, "adgroup_id" character varying NOT NULL, "ad" character varying NOT NULL, "ad_id" character varying NOT NULL, "client_id" character varying NOT NULL, "event_name" character varying NOT NULL, "event_time" character varying NOT NULL, "event_date" date NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_fc41bf2b50409288b16abc29b78" PRIMARY KEY ("client_id", "event_name", "event_time"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_event_date" ON "campaign_reports" ("event_date") `,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_ad_id_event_name_date" ON "campaign_reports" ("ad_id", "event_name", "event_date") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_ad_id_event_name_date"`);
    await queryRunner.query(`DROP INDEX "public"."idx_event_date"`);
    await queryRunner.query(`DROP TABLE "campaign_reports"`);
  }
}
