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
import { RegionService } from './region.service';
import { CreateRegionDto, UpdateRegionDto } from './dto/create-region.dto';

@ApiTags('Regions')
@Controller('regions')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  // List all regions.
  @ApiOperation({ summary: 'List regions' })
  @ApiResponse({ status: 200, description: 'Returns regions.' })
  @Get()
  async findAll() {
    return this.regionService.findAll();
  }

  // Get a region by ID.
  @ApiOperation({ summary: 'Get region by ID' })
  @ApiResponse({ status: 200, description: 'Returns a region.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const regionId = parseInt(id, 10);
    if (isNaN(regionId)) throw new BadRequestException('Invalid region ID');
    return this.regionService.findById(regionId);
  }

  // Create a region (admin only).
  @ApiOperation({ summary: 'Create region' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Creates a region.' })
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  // Update a region by ID (admin only).
  @ApiOperation({ summary: 'Update region' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Updates a region.' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateRegionDto: UpdateRegionDto,
  ) {
    const regionId = parseInt(id, 10);
    if (isNaN(regionId)) throw new BadRequestException('Invalid region ID');
    return this.regionService.update(regionId, updateRegionDto);
  }

  // Delete a region by ID (admin only).
  @ApiOperation({ summary: 'Delete region' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Deletes a region.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const regionId = parseInt(id, 10);
    if (isNaN(regionId)) throw new BadRequestException('Invalid region ID');
    await this.regionService.remove(regionId);
    return { success: true };
  }
}
