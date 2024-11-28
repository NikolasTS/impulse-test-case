import { Module } from '@nestjs/common';
import { ProbationApiService } from './api.service';

@Module({
  providers: [ProbationApiService],
  exports: [ProbationApiService],
})
export class ProbationApiModule {}
