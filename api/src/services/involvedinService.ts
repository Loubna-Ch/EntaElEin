import { ApiError } from '../middlewares/ApiError';
import { InvolvedInRepository } from '../repositories/involvedinRepository';

class InvolvedInService {
  static async getAll() {
    return await InvolvedInRepository.findAll();
  }

  static async getByIds(participantid: number, reportid: number) {
    const involvedIn = await InvolvedInRepository.findByIds(participantid, reportid);
    if (!involvedIn) {
      throw ApiError.notFound(`InvolvedIn link between Participant ${participantid} and Report ${reportid} not found`);
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
    oldParticipantId: number,
    oldReportId: number,
    updateData: {
      participantid: number;
      reportid: number;
    },
  ) {
    const involvedIn = await InvolvedInRepository.update(oldParticipantId, oldReportId, updateData);
    if (!involvedIn) {
      throw ApiError.notFound(`Could not update: InvolvedIn link not found`);
    }
    return involvedIn;
  }

  static async remove(participantid: number, reportid: number) {
    const deleted = await InvolvedInRepository.remove(participantid, reportid);
    if (!deleted) {
      throw ApiError.notFound(`InvolvedIn link not found`);
    }
    return { success: true, message: 'InvolvedIn link deleted successfully' };
  }
}

export default InvolvedInService;