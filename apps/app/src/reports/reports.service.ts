import { Injectable, Logger } from '@nestjs/common';
import { ProbationApiService } from 'src/api/api.service';
import { CampaignReport } from 'src/db/campaign_report.entity';
import { CampaignReportService } from 'src/campaign-report/campaign-report.service';
import { bufferCount, mergeMap, from, Observable, tap, last } from 'rxjs';
import { GetAggregatedReportsByAdIdDTO } from './dto';
import { FetchCampaignReportsParams } from './reports.types';

/**
 * @description Service for fetching and processing reports
 */
@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  /**
   * @description Batch size for processing reports
   */
  PROCESS_BATCH_SIZE = 20;

  constructor(
    private readonly apiService: ProbationApiService,
    private readonly campaignReportService: CampaignReportService,
  ) {}

  /**
   * @description Fetch and process reports
   * @param params - FetchCampaignReportsParams
   * @returns Observable<CampaignReport>
   */
  fetchAndProcessCampaignsReports(params: FetchCampaignReportsParams) {
    this.logger.debug(
      `Fetching reports. From ${params.from_date} to ${params.to_date} for event ${params.event_name}`,
    );
    const fetchData = this.apiService.fetchData(params);
    return this.processData(fetchData);
  }

  /**
   * @description Get aggregated reports by ad id
   * @param query - GetAggregatedReportsByAdIdDTO
   * @returns Promise<GetAggregatedReportsByAdIdResponse>
   */
  async getAggregatedReportsByAdId(query: GetAggregatedReportsByAdIdDTO) {
    const result =
      await this.campaignReportService.getAggregatedReportsByAdId(query);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      data: result.map(({ paginationCount, ...rest }) => rest),
      paginationCount: Number(result?.[0]?.paginationCount) || 0,
    };
  }

  /**
   * @description Process fetched data
   * @param {Observable<CampaignReport>} _data - observable with fetched data
   * @returns {Observable<CampaignReport>} - same but processed data
   */
  processData(_data: Observable<CampaignReport>) {
    return _data.pipe(
      bufferCount(this.PROCESS_BATCH_SIZE),
      mergeMap(async (data) => {
        // this.logger.debug('Processing batch of reports: ');
        // data.forEach((report) => this.logger.debug(report.toString()));
        try {
          await this.processBatchReports(data);
        } catch (error) {
          this.logger.error('Error processing batch of reports: ', error);
        }
        return data;
      }),
      mergeMap((data) => from(data)),
      tap((data) => this.logger.verbose(`Processed ${data.toString()}`)),
    );
  }

  /**
   * @description Process batch of reports
   * @param {CampaignReport[]} reports - array of reports
   */
  async processBatchReports(reports: CampaignReport[]) {
    this.campaignReportService.bulkUpsert(reports);
  }
}
