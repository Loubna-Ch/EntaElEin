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
import { HadasService } from './hadas.service';
import { CreateHadasDto, UpdateHadasDto } from './dto/create-hadas.dto';

@ApiTags('Hadas')
@ApiBearerAuth()
@Controller('hadas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class HadasController {
  constructor(private readonly hadasService: HadasService) {}

  // List all incident categories.
  @ApiOperation({ summary: 'List incident categories' })
  @ApiResponse({ status: 200, description: 'Returns categories.' })
  @Get()
  async findAll() {
    return this.hadasService.findAll();
  }

  // Get a category by ID.
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({ status: 200, description: 'Returns a category.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const hadasId = parseInt(id, 10);
    if (isNaN(hadasId)) throw new BadRequestException('Invalid hadas ID');
    return this.hadasService.findById(hadasId);
  }

  // Create a category.
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, description: 'Creates a category.' })
  @Post()
  async create(@Body() createHadasDto: CreateHadasDto) {
    return this.hadasService.create(createHadasDto);
  }

  // Update a category by ID.
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({ status: 200, description: 'Updates a category.' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHadasDto: UpdateHadasDto,
  ) {
    const hadasId = parseInt(id, 10);
    if (isNaN(hadasId)) throw new BadRequestException('Invalid hadas ID');
    return this.hadasService.update(hadasId, updateHadasDto);
  }

  // Delete a category by ID.
  @ApiOperation({ summary: 'Delete category' })
  @ApiResponse({ status: 200, description: 'Deletes a category.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const hadasId = parseInt(id, 10);
    if (isNaN(hadasId)) throw new BadRequestException('Invalid hadas ID');
    await this.hadasService.remove(hadasId);
    return { success: true };
  }
}
