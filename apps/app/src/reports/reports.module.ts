import { Module } from '@nestjs/common';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { ReportsCron } from './reports.crone';
import { CampaignReportModule } from 'src/campaign-report/campaign-report.module';
import { ProbationApiModule } from 'src/api/api.module';

@Module({
  imports: [CampaignReportModule, ProbationApiModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsCron],
})
export class ReportsModule {}
