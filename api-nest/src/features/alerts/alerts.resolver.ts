import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { AlertsService } from './alerts.service';
import { AlertFromAI } from './entities/alert-fromai.entity';
import { CreateAlertDto, UpdateAlertDto } from './dto/create-alert.dto';

@Resolver(() => AlertFromAI)
export class AlertsResolver {
  constructor(private readonly alertsService: AlertsService) {}

  @Query(() => [AlertFromAI])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async alerts() {
    return this.alertsService.findAllAlerts();
  }

  @Query(() => AlertFromAI)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async alert(@Args('id', { type: () => Int }) id: number) {
    return this.alertsService.findAlertById(id);
  }

  @Mutation(() => AlertFromAI)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createAlert(@Args('input') input: CreateAlertDto) {
    return this.alertsService.createAlert(input);
  }

  @Mutation(() => AlertFromAI)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateAlert(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateAlertDto,
  ) {
    return this.alertsService.updateAlert(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteAlert(@Args('id', { type: () => Int }) id: number) {
    await this.alertsService.removeAlert(id);
    return true;
  }
}
