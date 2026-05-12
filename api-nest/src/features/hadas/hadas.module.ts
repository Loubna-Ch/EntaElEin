import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hadas } from './entities/hadas.entity';
import { HadasService } from './hadas.service';
import { HadasController } from './hadas.controller';
import { HadasResolver } from './hadas.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Hadas])],
  controllers: [HadasController],
  providers: [HadasService, HadasResolver],
  exports: [HadasService],
})
export class HadasModule {}
