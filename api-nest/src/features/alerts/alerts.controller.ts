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
import { AlertsService } from './alerts.service';
import { CreateAlertDto, UpdateAlertDto } from './dto/create-alert.dto';

@ApiTags('Alerts')
@ApiBearerAuth()
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  // List all alerts (admin only).
  @ApiOperation({ summary: 'List alerts' })
  @ApiResponse({ status: 200, description: 'Returns alerts.' })
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findAll() {
    return this.alertsService.findAllAlerts();
  }

  // Get aggregated alert statistics (admin only).
  @ApiOperation({ summary: 'Get alert statistics' })
  @ApiResponse({ status: 200, description: 'Returns alert stats.' })
  @Get('stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getStats() {
    return this.alertsService.getAlertStats();
  }

  // Get a single alert by ID (admin only).
  @ApiOperation({ summary: 'Get alert by ID' })
  @ApiResponse({ status: 200, description: 'Returns an alert.' })
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async findOne(@Param('id') id: string) {
    const alertId = parseInt(id, 10);
    if (isNaN(alertId)) throw new BadRequestException('Invalid alert ID');
    return this.alertsService.findAlertById(alertId);
  }

  // Create an alert (admin only).
  @ApiOperation({ summary: 'Create alert' })
  @ApiResponse({ status: 201, description: 'Creates an alert.' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createAlertDto: CreateAlertDto) {
    return this.alertsService.createAlert(createAlertDto);
  }

  // Update an alert by ID (admin only).
  @ApiOperation({ summary: 'Update alert' })
  @ApiResponse({ status: 200, description: 'Updates an alert.' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateAlertDto: UpdateAlertDto,
  ) {
    const alertId = parseInt(id, 10);
    if (isNaN(alertId)) throw new BadRequestException('Invalid alert ID');
    return this.alertsService.updateAlert(alertId, updateAlertDto);
  }

  // Delete an alert by ID (admin only).
  @ApiOperation({ summary: 'Delete alert' })
  @ApiResponse({ status: 200, description: 'Deletes an alert.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const alertId = parseInt(id, 10);
    if (isNaN(alertId)) throw new BadRequestException('Invalid alert ID');
    await this.alertsService.removeAlert(alertId);
    return { success: true };
  }
}
