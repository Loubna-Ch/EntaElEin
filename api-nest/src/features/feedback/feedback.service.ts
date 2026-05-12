import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import {
  CreateFeedbackDto,
  UpdateFeedbackDto,
} from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    if (createFeedbackDto.rating < 1 || createFeedbackDto.rating > 5) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    const feedback = this.feedbackRepository.create(createFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      relations: ['user'],
      order: { feedbackid: 'DESC' },
    });
  }

  async findById(id: number): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { feedbackid: id },
      relations: ['user'],
    });
    if (!feedback) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }
    return feedback;
  }

  async update(
    id: number,
    updateFeedbackDto: UpdateFeedbackDto,
  ): Promise<Feedback> {
    if (
      updateFeedbackDto.rating &&
      (updateFeedbackDto.rating < 1 || updateFeedbackDto.rating > 5)
    ) {
      throw new BadRequestException('Rating must be between 1 and 5');
    }
    const feedback = await this.findById(id);
    Object.assign(feedback, updateFeedbackDto);
    return this.feedbackRepository.save(feedback);
  }

  async remove(id: number): Promise<void> {
    const result = await this.feedbackRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Feedback with id ${id} not found`);
    }
  }

  sanitizeFeedback(feedback: Feedback): Omit<Feedback, 'user'> & {
    user?: { userid: number; username: string; email: string };
  } {
    const { user, ...rest } = feedback;
    return {
      ...rest,
      user: user
        ? { userid: user.userid, username: user.username, email: user.email }
        : undefined,
    };
  }
}
