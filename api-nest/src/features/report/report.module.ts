import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../config/database.module';
import { InvolvedIn } from '../involvedin/entities/involved-in.entity';
import { CrimeReport } from './entities/crime-report.entity';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';
import { ReportResolver } from './report.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CrimeReport, InvolvedIn]), DatabaseModule],
  controllers: [ReportController],
  providers: [ReportService, ReportResolver],
  exports: [ReportService],
})
export class ReportModule {}
