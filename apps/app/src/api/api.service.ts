import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  from,
  map,
  catchError,
  of,
  switchMap,
  expand,
  takeWhile,
  Observable,
  filter,
} from 'rxjs';
import axios from 'axios';
import { CampaignReport } from '../db/campaign_report.entity';
import { readCSVStream } from '../utils/csv';
import { FetchApiDataQuery, ICampaignReportApi } from './api.interface';

@Injectable()
export class ProbationApiService implements ICampaignReportApi {
  private readonly logger = new Logger(ProbationApiService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(configService: ConfigService) {
    this.apiUrl = configService.getOrThrow('probationApi.url');
    this.apiKey = configService.getOrThrow('probationApi.key');
  }

  /**
   * @description Fetch and parse CSV data from API with pagination
   * @param {FetchApiDataQuery} params - query params
   * @returns {Observable<CampaignReport[]>} - observable with fetched data
   */
  fetchData(params: FetchApiDataQuery): Observable<CampaignReport> {
    this.logger.log('Fetch data from API');
    const initialUrl = `${this.apiUrl}/tasks/campaign/reports?from_date=${params.from_date}&to_date=${params.to_date}&event_name=${params.event_name}&take=100`;
    return this._fetch(initialUrl).pipe(
      this._paginate,
      this._parse,
      catchError((error: unknown) => {
        const err = error as Error;
        this.logger.error('API fetch error: ' + err.message, err.stack);
        return of(null);
      }),
    );
  }

  /**
   * @description Paginate API response
   * @param {Observable<any>} data - observable with API response
   * @returns {Observable<string>} - observable with CSV data
   */
  private _paginate = (data: Observable<any>) => {
    return data.pipe(
      expand((response) => {
        const nextUrl = response.data.pagination?.next;
        return nextUrl ? this._fetch(nextUrl) : of(null);
      }),
      takeWhile((response) => response !== null),
      map((response) => response.data.csv),
    );
  };

  /**
   * @description Parse CSV data
   * @param {Observable<string>} data - observable with CSV data
   * @returns {Observable<CampaignReport>} - observable with parsed data
   */
  private _parse(data: Observable<string>) {
    return data.pipe(
      switchMap((data) => readCSVStream(data)),
      switchMap((csvArray) => of(CampaignReport.fromCsv(csvArray))),
      filter((data) => data.ad_id !== 'ad_id'),
    );
  }

  /**
   * @description Fetch data from API
   * @param {string} url - API URL
   * @returns {Observable<any>} - observable with API response
   */
  private _fetch(url: string) {
    return from(
      axios.get(url, {
        headers: {
          'x-api-key': this.apiKey,
        },
      }),
    ).pipe(
      map((response) => {
        this.logger.debug('Get response for url: ', url);
        return response.data;
      }),
    );
  }
}
