import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { FeedbackService } from './feedback.service';
import { Feedback } from './entities/feedback.entity';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
} from './dto/create-feedback.dto';

@Resolver(() => Feedback)
export class FeedbackResolver {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Query(() => [Feedback])
  async feedbackList() {
    return this.feedbackService.findAll();
  }

  @Query(() => Feedback)
  async feedback(@Args('id', { type: () => Int }) id: number) {
    return this.feedbackService.findById(id);
  }

  @Mutation(() => Feedback)
  async createFeedback(@Args('input') input: CreateFeedbackDto) {
    return this.feedbackService.create(input);
  }

  @Mutation(() => Feedback)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateFeedback(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateFeedbackDto,
  ) {
    return this.feedbackService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteFeedback(@Args('id', { type: () => Int }) id: number) {
    await this.feedbackService.remove(id);
    return true;
  }
}
