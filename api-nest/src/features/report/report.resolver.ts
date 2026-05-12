import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { ReportService } from './report.service';
import { CrimeReport } from './entities/crime-report.entity';
import { CreateReportDto, UpdateReportDto } from './dto/create-report.dto';

@Resolver(() => CrimeReport)
export class ReportResolver {
  constructor(private readonly reportService: ReportService) {}

  @Query(() => [CrimeReport])
  async reports() {
    return this.reportService.findAll();
  }

  @Query(() => CrimeReport)
  async report(@Args('id', { type: () => Int }) id: number) {
    return this.reportService.findById(id);
  }

  @Mutation(() => CrimeReport)
  @UseGuards(JwtAuthGuard)
  async createReport(@Args('input') input: CreateReportDto) {
    return this.reportService.create(input);
  }

  @Mutation(() => CrimeReport)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateReport(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: UpdateReportDto,
  ) {
    return this.reportService.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteReport(@Args('id', { type: () => Int }) id: number) {
    await this.reportService.remove(id);
    return true;
  }
}
