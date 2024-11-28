import { Controller, Get, Query, Req } from '@nestjs/common';
import { ReportsService } from './reports.service';
import {
  InitiateFetchReportsDTO,
  GetAggregatedReportsByAdIdDTO,
  GetAggregatedReportsByAdIdResponse,
  InitiateFetchReportsResponse,
} from './dto';
import { Request } from 'express';
import { getPagination } from 'src/utils/pagination';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpErrorSchema } from 'src/app.types';
import { lastValueFrom, scan } from 'rxjs';

/**
 * @description Controller for reports
 */
@Controller('reports')
@ApiResponse({
  status: 400,
  description: 'Validation error',
  type: HttpErrorSchema,
})
@ApiResponse({
  status: 500,
  description: 'Internal server error',
  type: HttpErrorSchema,
  example: {
    message: 'Internal server error',
    statusCode: 500,
  },
})
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('/initiate')
  @ApiOperation({
    summary: 'Initiate fetching reports',
    description: 'Initiate fetching reports for target interval',
  })
  @ApiResponse({
    status: 200,
    description: 'Aggregated reports found',
    type: [InitiateFetchReportsResponse],
  })
  async initiateReports(@Query() query: InitiateFetchReportsDTO) {
    const count = await lastValueFrom(
      this.reportsService
        .fetchAndProcessCampaignsReports(query)
        .pipe(scan((acc, _) => acc + 1, 0)),
    );
    return {
      count,
      event_name: query.event_name,
      from_date: query.from_date,
      to_date: query.to_date,
    };
  }

  @Get('/aggregated/ad_id')
  @ApiOperation({
    summary: 'Get aggregated reports by ad_id',
    description: 'Get aggregated reports by ad_id',
  })
  @ApiResponse({
    status: 200,
    description: 'Aggregated reports found',
    type: [GetAggregatedReportsByAdIdResponse],
  })
  async getAggregatedReportsByAdId(
    @Query() query: GetAggregatedReportsByAdIdDTO,
    @Req() req: Request,
  ): Promise<GetAggregatedReportsByAdIdResponse> {
    const result = await this.reportsService.getAggregatedReportsByAdId(query);

    return {
      data: result.data,
      pagination: getPagination(
        req,
        result.paginationCount,
        query.take,
        query.page,
      ),
    };
  }
}
