import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { ParticipantService } from './participant.service';
import { Participant } from './entities/participant.entity';
import {
  CreateParticipantDto,
  UpdateParticipantDto,
} from './dto/create-participant.dto';

@Resolver(() => Participant)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ParticipantResolver {
  constructor(private readonly participantService: ParticipantService) {}

  @Query(() => [Participant])
  async participants() {
    return this.participantService.findAll();
  }

  @Query(() => Participant)
  async participant(@Args('id', { type: () => Int }) id: number) {
    return this.participantService.findById(id);
  }

  @Mutation(() => Participant)
  async createParticipant(@Args('input') input: CreateParticipantDto) {
    return this.participantService.create(input);
  }

  @Mutation(() => Participant)
  async updateParticipant(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateParticipantDto,
  ) {
    return this.participantService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteParticipant(@Args('id', { type: () => Int }) id: number) {
    await this.participantService.remove(id);
    return true;
  }
}
