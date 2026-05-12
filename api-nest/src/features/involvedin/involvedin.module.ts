import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvolvedIn } from './entities/involved-in.entity';
import { InvolvedInService } from './involvedin.service';
import { InvolvedInController } from './involvedin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvolvedIn])],
  controllers: [InvolvedInController],
  providers: [InvolvedInService],
  exports: [InvolvedInService],
})
export class InvolvedInModule {}
