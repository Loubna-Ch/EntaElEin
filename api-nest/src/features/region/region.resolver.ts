import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { RegionService } from './region.service';
import { Region } from './entities/region.entity';
import { CreateRegionDto, UpdateRegionDto } from './dto/create-region.dto';

@Resolver(() => Region)
export class RegionResolver {
  constructor(private readonly regionService: RegionService) {}

  @Query(() => [Region])
  async regions() {
    return this.regionService.findAll();
  }

  @Query(() => Region)
  async region(@Args('id', { type: () => Int }) id: number) {
    return this.regionService.findById(id);
  }

  @Mutation(() => Region)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createRegion(@Args('input') input: CreateRegionDto) {
    return this.regionService.create(input);
  }

  @Mutation(() => Region)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateRegion(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateRegionDto,
  ) {
    return this.regionService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteRegion(@Args('id', { type: () => Int }) id: number) {
    await this.regionService.remove(id);
    return true;
  }
}
