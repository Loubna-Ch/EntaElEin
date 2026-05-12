import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvolvedIn } from '../involvedin/entities/involved-in.entity';
import { Participant } from './entities/participant.entity';
import { ParticipantService } from './participant.service';
import { ParticipantController } from './participant.controller';
import { ParticipantResolver } from './participant.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Participant, InvolvedIn])],
  controllers: [ParticipantController],
  providers: [ParticipantService, ParticipantResolver],
  exports: [ParticipantService],
})
export class ParticipantModule {}
