import { ApiError } from '../middlewares/ApiError';
import { AlertFromAiRepository } from '../repositories/alertfromaiRepository';

class AlertFromAiService {
  static async getAll() {
    return await AlertFromAiRepository.findAll();
  }

  static async getById(id: number) {
    const alert = await AlertFromAiRepository.findById(id);
    if (!alert) {
      throw ApiError.notFound(`Alert with id ${id} not found`);
    }
    return alert;
  }

  static async create(data: {
    title: string;
    message: string;
    hadasid: number;    
  }) {
    return await AlertFromAiRepository.create(data);
  }

  static async update(
    id: number,
    updateData: {
      title: string;
      message: string;
      hadasid: number;
    },
  ) {
    const alert = await AlertFromAiRepository.update(id, updateData);
    if (!alert) {
      throw ApiError.notFound(`Alert with id ${id} not found`);
    }
    return alert;
  }

  static async remove(id: number) {
    const deleted = await AlertFromAiRepository.remove(id);
    if (!deleted) {
      throw ApiError.notFound(`Alert with id ${id} not found`);
    }
    return { success: true, message: 'Alert deleted' };
  }
}

export default AlertFromAiService;
  