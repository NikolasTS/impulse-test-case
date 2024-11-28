import { Observable } from 'rxjs';
import { CampaignReport } from 'src/db/campaign_report.entity';

export interface FetchApiDataQuery {
  from_date: string;
  to_date: string;
  event_name: string;
}

export interface ICampaignReportApi {
  fetchData(query: FetchApiDataQuery): Observable<CampaignReport>;
}
