import { ApiError } from '../middlewares/ApiError';
import { InvolvedInRepository } from '../repositories/involvedinRepository';

class InvolvedInService {
  static async getAll() {
    return await InvolvedInRepository.findAll();
  }

  static async getById(id: number) {
    const involvedIn = await InvolvedInRepository.findById(id);
    if (!involvedIn) {
      throw ApiError.notFound(`InvolvedIn with id ${id} not found`);
    }
    return involvedIn;
  }

  static async create(data: {
    participantid: number;
    reportid: number;
  }) {
    return await InvolvedInRepository.create(data);
  }

  static async update(
    id: number,
    updateData: {
      participantid: number;
      reportid: number;
    },
  ) {
    const involvedIn = await InvolvedInRepository.update(id, updateData);
    if (!involvedIn) {
      throw ApiError.notFound(`InvolvedIn with id ${id} not found`);
    }
    return involvedIn;
  }

  static async remove(id: number) {
    const deleted = await InvolvedInRepository.remove(id);
    if (!deleted) {
      throw ApiError.notFound(`InvolvedIn with id ${id} not found`);
    }
    return { success: true, message: 'InvolvedIn deleted' };
  }
}

export default InvolvedInService;
  