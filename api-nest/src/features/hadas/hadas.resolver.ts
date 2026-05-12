import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { HadasService } from './hadas.service';
import { Hadas } from './entities/hadas.entity';
import { CreateHadasDto, UpdateHadasDto } from './dto/create-hadas.dto';

@Resolver(() => Hadas)
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class HadasResolver {
  constructor(private readonly hadasService: HadasService) {}

  @Query(() => [Hadas])
  async hadasList() {
    return this.hadasService.findAll();
  }

  @Query(() => Hadas)
  async hadas(@Args('id', { type: () => Int }) id: number) {
    return this.hadasService.findById(id);
  }

  @Mutation(() => Hadas)
  async createHadas(@Args('input') input: CreateHadasDto) {
    return this.hadasService.create(input);
  }

  @Mutation(() => Hadas)
  async updateHadas(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateHadasDto,
  ) {
    return this.hadasService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteHadas(@Args('id', { type: () => Int }) id: number) {
    await this.hadasService.remove(id);
    return true;
  }
}
