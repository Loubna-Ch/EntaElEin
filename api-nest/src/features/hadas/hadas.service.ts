import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hadas } from './entities/hadas.entity';
import { CreateHadasDto, UpdateHadasDto } from './dto/create-hadas.dto';

@Injectable()
export class HadasService {
  constructor(
    @InjectRepository(Hadas)
    private hadasRepository: Repository<Hadas>,
  ) {}

  async create(createHadasDto: CreateHadasDto): Promise<Hadas> {
    const hadas = this.hadasRepository.create(createHadasDto);
    return this.hadasRepository.save(hadas);
  }

  async findAll(): Promise<Hadas[]> {
    return this.hadasRepository.find({
      order: { hadasid: 'ASC' },
    });
  }

  async findById(id: number): Promise<Hadas> {
    const hadas = await this.hadasRepository.findOne({
      where: { hadasid: id },
    });
    if (!hadas) {
      throw new NotFoundException(`Hadas with id ${id} not found`);
    }
    return hadas;
  }

  async update(id: number, updateHadasDto: UpdateHadasDto): Promise<Hadas> {
    const hadas = await this.findById(id);
    Object.assign(hadas, updateHadasDto);
    return this.hadasRepository.save(hadas);
  }

  async remove(id: number): Promise<void> {
    const result = await this.hadasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Hadas with id ${id} not found`);
    }
  }
}
