import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryColumn,
  Index,
} from 'typeorm';

@Entity('campaign_reports')
@Index('idx_ad_id_event_name_date', ['ad_id', 'event_name', 'event_date'])
@Index('idx_event_date', ['event_date'])
export class CampaignReport {
  @Column()
  campaign: string;

  @Column()
  campaign_id: string;

  @Column()
  adgroup: string;

  @Column()
  adgroup_id: string;

  @Column()
  ad: string;

  @Column()
  ad_id: string;

  @PrimaryColumn()
  client_id: string;

  @PrimaryColumn()
  event_name: string;

  @PrimaryColumn()
  event_time: string;

  @Column({ type: 'date' })
  event_date: Date;

  @CreateDateColumn({
    type: 'timestamptz',
    transformer: {
      from: (value: Date) => value.toISOString(),
      to: (value: string) => value,
    },
  })
  created_at?: string;

  static fromCsv(data: string[]) {
    const report = new CampaignReport();
    report.ad = data[0];
    report.ad_id = data[1];
    report.adgroup = data[2];
    report.adgroup_id = data[3];
    report.campaign = data[4];
    report.campaign_id = data[5];
    report.client_id = data[6];
    report.event_name = data[7];
    report.event_time = data[8];
    return report;
  }

  toString() {
    return `CampaignReport: client_id: ${this.client_id}, event_name: ${this.event_name}, event_time: ${this.event_time}, campaign: ${this.campaign}, adgroup: ${this.adgroup}, ad: ${this.ad}`;
  }
}
