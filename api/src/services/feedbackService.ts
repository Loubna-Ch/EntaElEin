import { ApiError } from '../middlewares/ApiError';
import { FeedbackRepository } from '../repositories/feedbackRepository';

class FeedbackService {
  static async getAll() {
    return await FeedbackRepository.findAll();
  }

  static async getById(id: number) {
    const feedback = await FeedbackRepository.findById(id);
    if (!feedback) {
      throw ApiError.notFound(`Feedback with id ${id} not found`);
    }
    return feedback;
  }

  static async create(data: {
    content: string;
    rating: number; 
    userid: number; 
  }) {
    if (data.rating < 1 || data.rating > 5) {
      throw ApiError.badRequest('Rating must be between 1 and 5');
    }
    return await FeedbackRepository.create(data);
  }

  static async update(
    id: number,
    updateData: {
      content: string;
      rating: number;
      userid: number;
    },
  ) {
    if (updateData.rating < 1 || updateData.rating > 5) {
      throw ApiError.badRequest('Rating must be between 1 and 5');
    }

    const feedback = await FeedbackRepository.update(id, updateData);
    if (!feedback) {
      throw ApiError.notFound(`Feedback with id ${id} not found`);
    }
    return feedback;
  }

  static async remove(id: number) {
    const deleted = await FeedbackRepository.remove(id);
    if (!deleted) {
      throw ApiError.notFound(`Feedback with id ${id} not found`);
    }
    return { success: true, message: 'Feedback deleted successfully' };
  }
}

export default FeedbackService;