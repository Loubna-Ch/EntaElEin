import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { ReportService } from './report.service';
import { CreateReportDto, UpdateReportDto } from './dto/create-report.dto';

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  // List all reports with sanitized payloads.
  @ApiOperation({ summary: 'List all reports' })
  @ApiResponse({ status: 200, description: 'Returns all reports.' })
  @Get()
  async findAll() {
    const reports = await this.reportService.findAll();
    return reports.map((r) => this.reportService.sanitizeReport(r));
  }

  // Get aggregated report statistics for admins.
  @ApiOperation({ summary: 'Get report statistics' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Returns report stats.' })
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getStats() {
    return this.reportService.getReportStats();
  }

  // Get a single report by ID.
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiResponse({ status: 200, description: 'Returns a report.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) throw new BadRequestException('Invalid report ID');
    const report = await this.reportService.findById(reportId);
    return this.reportService.sanitizeReport(report);
  }

  // Create a new report (authenticated users).
  @ApiOperation({ summary: 'Create report' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Creates a report.' })
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createReportDto: CreateReportDto) {
    const report = await this.reportService.create(createReportDto);
    return this.reportService.sanitizeReport(report);
  }

  // Update a report by ID (admin only).
  @ApiOperation({ summary: 'Update report' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Updates a report.' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateReportDto: UpdateReportDto,
  ) {
    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) throw new BadRequestException('Invalid report ID');
    const report = await this.reportService.update(reportId, updateReportDto);
    return this.reportService.sanitizeReport(report);
  }

  // Delete a report by ID (admin only).
  @ApiOperation({ summary: 'Delete report' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Deletes a report.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const reportId = parseInt(id, 10);
    if (isNaN(reportId)) throw new BadRequestException('Invalid report ID');
    await this.reportService.remove(reportId);
    return { success: true };
  }
}
