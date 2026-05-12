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
import { InvolvedInService } from './involvedin.service';
import { CreateInvolvedInDto } from './dto/create-involved-in.dto';

@ApiTags('InvolvedIn')
@ApiBearerAuth()
@Controller('involvedin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class InvolvedInController {
  constructor(private readonly involvedInService: InvolvedInService) {}

  // List all involved-in records (admin only).
  @ApiOperation({ summary: 'List involved-in records' })
  @ApiResponse({ status: 200, description: 'Returns involved-in records.' })
  @Get()
  async findAll() {
    return this.involvedInService.findAll();
  }

  // Create a participant/report link (admin only).
  @ApiOperation({ summary: 'Create involved-in record' })
  @ApiResponse({ status: 201, description: 'Creates an involved-in record.' })
  @Post()
  async create(@Body() createDto: CreateInvolvedInDto) {
    return this.involvedInService.create(createDto);
  }

  // Delete a participant/report link (admin only).
  @ApiOperation({ summary: 'Delete involved-in record' })
  @ApiResponse({ status: 200, description: 'Deletes an involved-in record.' })
  @Delete(':participantid/:reportid')
  async remove(
    @Param('participantid') participantidParam: string,
    @Param('reportid') reportidParam: string,
  ) {
    const participantid = parseInt(participantidParam, 10);
    const reportid = parseInt(reportidParam, 10);
    if (isNaN(participantid) || isNaN(reportid)) {
      throw new BadRequestException('Invalid participant or report ID');
    }

    await this.involvedInService.remove(participantid, reportid);
    return { success: true };
  }
}
