import { MigrationInterface, QueryRunner } from "typeorm";

export class DateTriggerCampaignReports1732821949843
  implements MigrationInterface
{
  name = "DateTriggerCampaignReports1732821949843";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION set_event_date() 
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.event_date = DATE(NEW.event_time);
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryRunner.query(
      `
        CREATE TRIGGER set_event_date_before_insert
        BEFORE INSERT ON campaign_reports
        FOR EACH ROW
        EXECUTE FUNCTION set_event_date();
      `
    );

    await queryRunner.query(
      `
        CREATE TRIGGER set_event_date_before_update
        BEFORE UPDATE ON campaign_reports
        FOR EACH ROW
        EXECUTE FUNCTION set_event_date();
      `
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TRIGGER set_event_date_before_insert`);
    await queryRunner.query(`DROP TRIGGER set_event_date_before_update`);
  }
}
