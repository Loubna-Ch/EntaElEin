import { ApiError } from '../middlewares/ApiError';
import { RegionRepository } from '../repositories/regionRepository';

class RegionService {
  static async getAll() {
    return await RegionRepository.findAll();
  }

  static async getById(id: number) {
    const region = await RegionRepository.findById(id);
    if (!region) {
      throw ApiError.notFound(`Region with id ${id} not found`);
    }
    return region;
  }

  static async create(data: {
    regionname: string;
  }) {
    return await RegionRepository.create(data);
  }

  static async update(
    id: number,
    updateData: {
      regionname: string;
    },
  ) {
    const region = await RegionRepository.update(id, updateData);
    if (!region) {
      throw ApiError.notFound(`Region with id ${id} not found`);
    }
    return region;
  }

  static async remove(id: number) {
    const deleted = await RegionRepository.remove(id);
    if (!deleted) {
      throw ApiError.notFound(`Region with id ${id} not found`);
    }
    return { success: true, message: 'Region deleted' };
  }
}

export default RegionService;
  