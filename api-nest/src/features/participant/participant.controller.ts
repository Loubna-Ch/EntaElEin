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
import { ParticipantService } from './participant.service';
import {
  CreateParticipantDto,
  UpdateParticipantDto,
} from './dto/create-participant.dto';

@ApiTags('Participants')
@ApiBearerAuth()
@Controller('participants')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class ParticipantController {
  constructor(private readonly participantService: ParticipantService) {}

  // List all participants (admin only).
  @ApiOperation({ summary: 'List participants' })
  @ApiResponse({ status: 200, description: 'Returns participants.' })
  @Get()
  async findAll() {
    return this.participantService.findAll();
  }

  // Get a participant by ID (admin only).
  @ApiOperation({ summary: 'Get participant by ID' })
  @ApiResponse({ status: 200, description: 'Returns a participant.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const participantId = parseInt(id, 10);
    if (isNaN(participantId))
      throw new BadRequestException('Invalid participant ID');
    return this.participantService.findById(participantId);
  }

  // Create a participant (admin only).
  @ApiOperation({ summary: 'Create participant' })
  @ApiResponse({ status: 201, description: 'Creates a participant.' })
  @Post()
  async create(@Body() createParticipantDto: CreateParticipantDto) {
    return this.participantService.create(createParticipantDto);
  }

  // Update a participant by ID (admin only).
  @ApiOperation({ summary: 'Update participant' })
  @ApiResponse({ status: 200, description: 'Updates a participant.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateParticipantDto: UpdateParticipantDto,
  ) {
    const participantId = parseInt(id, 10);
    if (isNaN(participantId))
      throw new BadRequestException('Invalid participant ID');
    return this.participantService.update(participantId, updateParticipantDto);
  }

  // Delete a participant by ID (admin only).
  @ApiOperation({ summary: 'Delete participant' })
  @ApiResponse({ status: 200, description: 'Deletes a participant.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const participantId = parseInt(id, 10);
    if (isNaN(participantId))
      throw new BadRequestException('Invalid participant ID');
    await this.participantService.remove(participantId);
    return { success: true };
  }
}
