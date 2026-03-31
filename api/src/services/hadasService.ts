import { ApiError } from '../middlewares/ApiError';
import { HadasRepository } from '../repositories/hadasRepository';

class HadasService {
  static async getAll() {
    return await HadasRepository.findAll();
  }

  static async getById(id: number) {
    const hadas = await HadasRepository.findById(id);
    if (!hadas) {
      throw ApiError.notFound(`Hadas with id ${id} not found`);
    }
    return hadas;
  }

  static async create(data: {
    hadasdescription: string;
  }) {
    return await HadasRepository.create(data);
  }

  static async update(
    id: number,
    updateData: {
      hadasdescription: string;
    },
  ) {
    const hadas = await HadasRepository.update(id, updateData);
    if (!hadas) {
      throw ApiError.notFound(`Hadas with id ${id} not found`);
    }
    return hadas;
  }

  static async remove(id: number) {
    const deleted = await HadasRepository.remove(id);
    if (!deleted) {
      throw ApiError.notFound(`Hadas with id ${id} not found`);
    }
    return { success: true, message: 'Hadas deleted' };
  }
}

export default HadasService;