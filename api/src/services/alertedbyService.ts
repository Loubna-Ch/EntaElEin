import { ApiError } from '../middlewares/ApiError';
import { AlertedByRepository } from '../repositories/alertedbyRepository';

class AlertedByService {
  static async getAll() {
    return await AlertedByRepository.findAll();
  }
  
  static async getByIds(userid: number, alertid: number) {
    const alertedBy = await AlertedByRepository.findByIds(userid, alertid);
    if (!alertedBy) {
      throw ApiError.notFound(`AlertedBy link between User ${userid} and Alert ${alertid} not found`);
    }
    return alertedBy;
  }

  static async create(data: {
    userid: number;
    alertid: number;
  }) {
    return await AlertedByRepository.create(data);
  }

  static async update(
    oldUserId: number,
    oldAlertId: number,
    updateData: {
      userid: number;
      alertid: number;
    },
  ) {
    const alertedBy = await AlertedByRepository.update(oldUserId, oldAlertId, updateData);
    if (!alertedBy) {
      throw ApiError.notFound(`Could not update: AlertedBy link not found`);
    }
    return alertedBy;
  }

  static async remove(userid: number, alertid: number) {
    const deleted = await AlertedByRepository.remove(userid, alertid);
    if (!deleted) {
      throw ApiError.notFound(`AlertedBy link not found`);
    }
    return { success: true, message: 'AlertedBy link deleted successfully' };
  }
}

export default AlertedByService;