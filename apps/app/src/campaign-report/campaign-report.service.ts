import { Injectable } from '@nestjs/common';
import { CampaignReport } from 'src/db/campaign_report.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetAggregatedReportsByAdIdDTO } from 'src/reports/dto';

/**
 * @description Repository-service for campaign reports
 */
@Injectable()
export class CampaignReportService {
  constructor(
    @InjectRepository(CampaignReport)
    private readonly campaignReportRepository: Repository<CampaignReport>,
  ) {}

  /**
   * @description Bulk upsert campaign reports
   * @dev ON CONFLICT IGNORE
   * @param data - Campaign reports
   */
  async bulkUpsert(data: CampaignReport[]) {
    await this.campaignReportRepository
      .createQueryBuilder()
      .insert()
      .into(CampaignReport)
      .values(data)
      .orIgnore()
      .execute();
  }

  /**
   * @description Get aggregated reports by ad id
   * @param {GetAggregatedReportsByAdIdDTO} query - query params
   */
  async getAggregatedReportsByAdId(query: GetAggregatedReportsByAdIdDTO) {
    const offset = query.page * query.take;
    return await this.campaignReportRepository
      .createQueryBuilder()
      .select('ad_id')
      .addSelect('event_name')
      .addSelect('DATE(event_time)', 'date')
      .addSelect('COUNT(*)', 'count')
      .addSelect('COUNT(*) OVER()', 'paginationCount')
      .where('event_name = :eventName', { eventName: query.event_name })
      .andWhere('event_time BETWEEN :startDate AND :endDate', {
        startDate: query.from_date,
        endDate: query.to_date,
      })
      .groupBy('ad_id')
      .addGroupBy('event_name')
      .addGroupBy('DATE(event_time)')
      .orderBy('date', 'ASC')
      .addOrderBy('ad_id', 'ASC')
      .offset(offset)
      .limit(query.take)
      .getRawMany();
  }
}
