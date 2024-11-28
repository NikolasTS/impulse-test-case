import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsDateString,
  IsInt,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ReportsEventName } from '../reports.types';
import { Type } from 'class-transformer';

export class InitiateFetchReportsDTO {
  @ApiProperty({
    description: 'The start date of the reports to fetch',
    example: '2024-11-25T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  from_date: string;

  @ApiProperty({
    description: 'The end date of the reports to fetch',
    example: '2024-11-26T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty()
  to_date: string;

  @ApiProperty({
    description: 'The event name of the reports to fetch',
    example: 'install',
    required: true,
    enum: ReportsEventName,
  })
  @IsNotEmpty()
  event_name: ReportsEventName;
}

export class GetAggregatedReportsByAdIdDTO {
  @ApiProperty({
    description: 'The start date of the reports',
    example: '2024-11-25T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty()
  @IsDateString()
  from_date: string;

  @ApiProperty({
    description: 'The end date of the reports',
    example: '2024-11-26T00:00:00.000Z',
    required: true,
  })
  @IsNotEmpty()
  to_date: string;

  @ApiProperty({
    description: 'The event name of the reports',
    example: 'install',
    required: true,
    enum: ReportsEventName,
  })
  @IsNotEmpty()
  event_name: ReportsEventName;

  @ApiProperty({
    description: 'The number of reports to get',
    example: 10,
    required: false,
    // maximum: 1000,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Max(1000)
  @Type(() => Number)
  take?: number;

  @ApiProperty({
    description: 'The page number of the reports',
    example: 1,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  page?: number = 0;
}

export class AggregatedCampaignReport {
  @ApiProperty({
    description: 'The ad id',
    example: '4a58620a-6364-49e9-8a3d-770254f2ba30',
  })
  ad_id: string;

  @ApiProperty({
    description: 'The event name',
    example: 'install',
  })
  event_name: ReportsEventName;

  @ApiProperty({
    description: 'The date aggregated by',
    example: '2024-11-24T22:00:00.000Z',
  })
  date: string;

  @ApiProperty({
    description: 'The count of the event',
    example: '33',
  })
  count: string;
}

export class Pagination {
  @ApiProperty({
    description: 'The next page url',
  })
  next: string | null;

  @ApiProperty({
    description: 'The total number of pages',
  })
  totalPages: number;
}

export class GetAggregatedReportsByAdIdResponse {
  @ApiProperty({
    isArray: true,
    type: [AggregatedCampaignReport],
  })
  data: AggregatedCampaignReport[];

  @ApiProperty({
    description: 'The pagination',
    type: Pagination,
  })
  pagination: Pagination;
}

export class InitiateFetchReportsResponse {
  @ApiProperty({
    description: 'The count of the processedreports',
    example: 10,
  })
  count: number;

  @ApiProperty({
    description: 'The event name',
    example: 'install',
  })
  event_name: ReportsEventName;

  @ApiProperty({
    description: 'The start date',
    example: '2024-11-25T00:00:00.000Z',
  })
  from_date: string;

  @ApiProperty({
    description: 'The end date',
    example: '2024-11-26T00:00:00.000Z',
  })
  to_date: string;
}
