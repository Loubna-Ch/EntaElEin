import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Region } from './entities/region.entity';
import { CreateRegionDto, UpdateRegionDto } from './dto/create-region.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private regionRepository: Repository<Region>,
  ) {}

  async create(createRegionDto: CreateRegionDto): Promise<Region> {
    const region = this.regionRepository.create(createRegionDto);
    return this.regionRepository.save(region);
  }

  async findAll(): Promise<Region[]> {
    return this.regionRepository.find({
      order: { regionid: 'ASC' },
    });
  }

  async findById(id: number): Promise<Region> {
    const region = await this.regionRepository.findOne({
      where: { regionid: id },
    });
    if (!region) {
      throw new NotFoundException(`Region with id ${id} not found`);
    }
    return region;
  }

  async update(id: number, updateRegionDto: UpdateRegionDto): Promise<Region> {
    const region = await this.findById(id);
    Object.assign(region, updateRegionDto);
    return this.regionRepository.save(region);
  }

  async remove(id: number): Promise<void> {
    const result = await this.regionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Region with id ${id} not found`);
    }
  }
}
