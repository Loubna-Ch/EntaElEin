import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AlertedBy } from '../alerts/entities/alerted-by.entity';
import { CreateAlertedByDto } from './dto/create-alerted-by.dto';

@Injectable()
export class AlertedByService {
  constructor(
    @InjectRepository(AlertedBy)
    private readonly alertedByRepository: Repository<AlertedBy>,
  ) {}

  async findAll(): Promise<AlertedBy[]> {
    return this.alertedByRepository.find({
      relations: ['user', 'alert'],
      order: { sentat: 'DESC' },
    });
  }

  async findByUser(userid: number): Promise<AlertedBy[]> {
    return this.alertedByRepository.find({
      where: { userid },
      relations: ['alert'],
      order: { sentat: 'DESC' },
    });
  }

  async create(createDto: CreateAlertedByDto): Promise<AlertedBy> {
    const existing = await this.alertedByRepository.findOne({
      where: { userid: createDto.userid, alertid: createDto.alertid },
    });

    if (existing) {
      return existing;
    }

    const record = this.alertedByRepository.create(createDto);
    return this.alertedByRepository.save(record);
  }

  async remove(userid: number, alertid: number): Promise<void> {
    const result = await this.alertedByRepository.delete({ userid, alertid });
    if (result.affected === 0) {
      throw new NotFoundException(
        `AlertedBy record not found for user ${userid} and alert ${alertid}`,
      );
    }
  }
}
