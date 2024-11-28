import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignReportModule } from './campaign-report/campaign-report.module';
import { ProbationApiModule } from './api/api.module';
import { ReportsModule } from './reports/reports.module';
import databaseConfig from './config/database.config';
import probationApiConfig from './config/probation.api.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, probationApiConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'postgres',
          url: config.getOrThrow('database.url'),
          entities: [__dirname + '/db/*.entity{.ts,.js}'],
          migrations: [__dirname + '/db/migrations/*'],
          synchronize: false,
          logging: ['error'],
        };
      },
      inject: [ConfigService],
    }),
    CampaignReportModule,
    ProbationApiModule,
    ReportsModule,
  ],
})
export class AppModule {}
