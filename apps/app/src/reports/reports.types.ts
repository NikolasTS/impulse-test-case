/**
 * @description Event names for reports
 */
export enum ReportsEventName {
  INSTALL = 'install',
  PURCHASE = 'purchase',
}

/**
 * @description Params for fetching reports
 */
export interface FetchCampaignReportsParams {
  from_date: string;
  to_date: string;
  event_name: ReportsEventName;
}
