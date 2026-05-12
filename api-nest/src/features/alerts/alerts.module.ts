import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '../../config/database.module';
import { AlertFromAI } from './entities/alert-fromai.entity';
import { AlertedBy } from './entities/alerted-by.entity';
import { AlertsService } from './alerts.service';
import { AlertsController } from './alerts.controller';
import { AlertsResolver } from './alerts.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([AlertFromAI, AlertedBy]), DatabaseModule],
  controllers: [AlertsController],
  providers: [AlertsService, AlertsResolver],
  exports: [AlertsService],
})
export class AlertsModule {}
