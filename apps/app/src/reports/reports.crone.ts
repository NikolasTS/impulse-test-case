import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { FetchCampaignReportsParams, ReportsEventName } from './reports.types';
import { interval, merge } from 'rxjs';
import { tap, switchMap, startWith, scan, last } from 'rxjs/operators';

/**
 * @description Cron job for fetching reports
 * @dev Implemented by rxJs interval, but could be implemented by cron
 */
@Injectable()
export class ReportsCron implements OnApplicationBootstrap {
  logger = new Logger(ReportsCron.name);
  INTERVAL_MS = 1000 * 60 * 60; // 1 hour

  constructor(private readonly reportsService: ReportsService) {}

  async onApplicationBootstrap() {
    this.startInterval();
  }

  /**
   * @description Start interval for fetching reports when app is started
   */
  async startInterval() {
    interval(this.INTERVAL_MS)
      .pipe(
        startWith(0),
        tap(() => this.logger.log('Start interval for reports fetching.')),
        switchMap(() => {
          const params1 = this.getReportsParams(ReportsEventName.INSTALL);

          const fetch1 =
            this.reportsService.fetchAndProcessCampaignsReports(params1);

          const params2 = this.getReportsParams(ReportsEventName.PURCHASE);

          const fetch2 =
            this.reportsService.fetchAndProcessCampaignsReports(params2);

          return merge(fetch1, fetch2).pipe(
            scan((acc, _) => acc + 1, 0),
            last(),
            tap((value) => this.logger.log(`Fetched ${value} reports.`)),
          );
        }),
      )
      .subscribe({
        error: (err) => this.logger.error('Error fetching reports: ', err),
      });
  }

  /**
   * Get reports params for last 24 hours
   * @param eventName - event name
   * @returns FetchCampaignReportsParams
   */
  getReportsParams(eventName: ReportsEventName): FetchCampaignReportsParams {
    const now = new Date();
    // get two dates - for last 24 hours
    const fromDate = new Date(now.setDate(now.getDate() - 1));
    const toDate = new Date();

    return {
      from_date: fromDate.toISOString(),
      to_date: toDate.toISOString(),
      event_name: eventName,
    };
  }
}
