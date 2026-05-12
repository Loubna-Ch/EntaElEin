import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvolvedIn } from './entities/involved-in.entity';
import { CreateInvolvedInDto } from './dto/create-involved-in.dto';

@Injectable()
export class InvolvedInService {
  constructor(
    @InjectRepository(InvolvedIn)
    private readonly involvedInRepository: Repository<InvolvedIn>,
  ) {}

  async findAll(): Promise<InvolvedIn[]> {
    return this.involvedInRepository.find({
      order: { reportid: 'DESC', participantid: 'ASC' },
    });
  }

  async create(createDto: CreateInvolvedInDto): Promise<InvolvedIn> {
    const existing = await this.involvedInRepository.findOne({
      where: {
        participantid: createDto.participantid,
        reportid: createDto.reportid,
      },
    });

    if (existing) {
      return existing;
    }

    const link = this.involvedInRepository.create(createDto);
    return this.involvedInRepository.save(link);
  }

  async remove(participantid: number, reportid: number): Promise<void> {
    const result = await this.involvedInRepository.delete({
      participantid,
      reportid,
    });

    if (result.affected === 0) {
      throw new NotFoundException(
        `InvolvedIn record not found for participant ${participantid} and report ${reportid}`,
      );
    }
  }
}
