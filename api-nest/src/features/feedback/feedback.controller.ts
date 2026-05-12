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
import { FeedbackService } from './feedback.service';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
} from './dto/create-feedback.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Feedback')
@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  // List all feedback entries.
  @ApiOperation({ summary: 'List feedback' })
  @ApiResponse({ status: 200, description: 'Returns feedback entries.' })
  @Get()
  async findAll() {
    const feedback = await this.feedbackService.findAll();
    return feedback.map((f) => this.feedbackService.sanitizeFeedback(f));
  }

  // Get a feedback entry by ID.
  @ApiOperation({ summary: 'Get feedback by ID' })
  @ApiResponse({ status: 200, description: 'Returns a feedback entry.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const feedbackId = parseInt(id, 10);
    if (isNaN(feedbackId)) throw new BadRequestException('Invalid feedback ID');
    const feedback = await this.feedbackService.findById(feedbackId);
    return this.feedbackService.sanitizeFeedback(feedback);
  }

  // Create a feedback entry.
  @ApiOperation({ summary: 'Create feedback' })
  @ApiResponse({ status: 201, description: 'Creates feedback.' })
  @Post()
  async create(@Body() createFeedbackDto: CreateFeedbackDto) {
    const feedback = await this.feedbackService.create(createFeedbackDto);
    return this.feedbackService.sanitizeFeedback(feedback);
  }

  // Update feedback by ID (admin only).
  @ApiOperation({ summary: 'Update feedback' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Updates feedback.' })
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateFeedbackDto: UpdateFeedbackDto,
  ) {
    const feedbackId = parseInt(id, 10);
    if (isNaN(feedbackId)) throw new BadRequestException('Invalid feedback ID');
    const feedback = await this.feedbackService.update(
      feedbackId,
      updateFeedbackDto,
    );
    return this.feedbackService.sanitizeFeedback(feedback);
  }

  // Delete feedback by ID (admin only).
  @ApiOperation({ summary: 'Delete feedback' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Deletes feedback.' })
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    const feedbackId = parseInt(id, 10);
    if (isNaN(feedbackId)) throw new BadRequestException('Invalid feedback ID');
    await this.feedbackService.remove(feedbackId);
    return { success: true };
  }
}
