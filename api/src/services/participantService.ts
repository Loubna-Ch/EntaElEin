import { ApiError } from '../middlewares/ApiError';
import { ParticipantsRepository } from '../repositories/participantRepository';

class ParticipantsService {
  static async getAll() {
    return await ParticipantsRepository.findAll();
  }

  static async getById(id: number) {
    const participant = await ParticipantsRepository.findById(id);
    if (!participant) {
      throw ApiError.notFound(`Participant with id ${id} not found`);
    }
    return participant;
  }

  static async create(data: {
    participantname: string;
    pdateofbirth?: string;
    gender?: string;
    description?: string;
    participanttype: string;
  }) {
    return await ParticipantsRepository.create(data);
  }

  static async update(
    id: number,
    updateData: {
      participantname: string;
      pdateofbirth?: string;
      gender?: string;
      description?: string;
      participanttype?: string;
    },
  ) {
    const participant = await ParticipantsRepository.update(id, updateData);
    if (!participant) {
      throw ApiError.notFound(`Participant with id ${id} not found`);
    }
    return participant;
  }

  static async remove(id: number) {
    const deleted = await ParticipantsRepository.remove(id);
    if (!deleted) {
      throw ApiError.notFound(`Participant with id ${id} not found`);
    }
    return { success: true, message: 'Participant deleted' };
  }
}

export default ParticipantsService;
   