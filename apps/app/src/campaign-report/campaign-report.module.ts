import { Module } from '@nestjs/common';
import { CampaignReportService } from './campaign-report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignReport } from 'src/db/campaign_report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignReport])],
  providers: [CampaignReportService],
  exports: [CampaignReportService],
})
export class CampaignReportModule {}
