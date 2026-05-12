import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './entities/region.entity';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { RegionResolver } from './region.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Region])],
  controllers: [RegionController],
  providers: [RegionService, RegionResolver],
  exports: [RegionService],
})
export class RegionModule {}
