import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Participant } from './entities/participant.entity';
import {
  CreateParticipantDto,
  UpdateParticipantDto,
} from './dto/create-participant.dto';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(Participant)
    private participantRepository: Repository<Participant>,
  ) {}

  async create(
    createParticipantDto: CreateParticipantDto,
  ): Promise<Participant> {
    const participant = this.participantRepository.create(createParticipantDto);
    return this.participantRepository.save(participant);
  }

  async findAll(): Promise<Participant[]> {
    return this.participantRepository.find({
      order: { participantid: 'ASC' },
    });
  }

  async findById(id: number): Promise<Participant> {
    const participant = await this.participantRepository.findOne({
      where: { participantid: id },
      relations: ['reports'],
    });
    if (!participant) {
      throw new NotFoundException(`Participant with id ${id} not found`);
    }
    return participant;
  }

  async update(
    id: number,
    updateParticipantDto: UpdateParticipantDto,
  ): Promise<Participant> {
    const participant = await this.findById(id);
    Object.assign(participant, updateParticipantDto);
    return this.participantRepository.save(participant);
  }

  async remove(id: number): Promise<void> {
    const result = await this.participantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Participant with id ${id} not found`);
    }
  }
}
