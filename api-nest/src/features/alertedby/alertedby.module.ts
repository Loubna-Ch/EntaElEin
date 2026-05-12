import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlertedBy } from '../alerts/entities/alerted-by.entity';
import { AlertedByService } from './alertedby.service';
import { AlertedByController } from './alertedby.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AlertedBy])],
  controllers: [AlertedByController],
  providers: [AlertedByService],
  exports: [AlertedByService],
})
export class AlertedByModule {}
