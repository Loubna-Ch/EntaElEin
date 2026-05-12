import {
  Controller,
  Get,
  Post,
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
import { AlertedByService } from './alertedby.service';
import { CreateAlertedByDto } from './dto/create-alerted-by.dto';

@ApiTags('AlertedBy')
@ApiBearerAuth()
@Controller('alertedby')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AlertedByController {
  constructor(private readonly alertedByService: AlertedByService) {}

  // List all alerted-by records (admin only).
  @ApiOperation({ summary: 'List alerted-by records' })
  @ApiResponse({ status: 200, description: 'Returns alerted-by records.' })
  @Get()
  async findAll() {
    return this.alertedByService.findAll();
  }

  // List alert deliveries for a user (admin only).
  @ApiOperation({ summary: 'List alerted-by records for a user' })
  @ApiResponse({ status: 200, description: 'Returns alerted-by records for a user.' })
  @Get('user/:userid')
  async findByUser(@Param('userid') useridParam: string) {
    const userid = parseInt(useridParam, 10);
    if (isNaN(userid)) {
      throw new BadRequestException('Invalid user ID');
    }

    return this.alertedByService.findByUser(userid);
  }

  // Create a user/alert link (admin only).
  @ApiOperation({ summary: 'Create alerted-by record' })
  @ApiResponse({ status: 201, description: 'Creates an alerted-by record.' })
  @Post()
  async create(@Body() createDto: CreateAlertedByDto) {
    return this.alertedByService.create(createDto);
  }

  // Delete a user/alert link (admin only).
  @ApiOperation({ summary: 'Delete alerted-by record' })
  @ApiResponse({ status: 200, description: 'Deletes an alerted-by record.' })
  @Delete(':userid/:alertid')
  async remove(
    @Param('userid') useridParam: string,
    @Param('alertid') alertidParam: string,
  ) {
    const userid = parseInt(useridParam, 10);
    const alertid = parseInt(alertidParam, 10);
    if (isNaN(userid) || isNaN(alertid)) {
      throw new BadRequestException('Invalid user or alert ID');
    }

    await this.alertedByService.remove(userid, alertid);
    return { success: true };
  }
}
