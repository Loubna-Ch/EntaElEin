import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../config/database.service';
import { AlertFromAI } from './entities/alert-fromai.entity';
import { AlertedBy } from './entities/alerted-by.entity';
import { CreateAlertDto, UpdateAlertDto } from './dto/create-alert.dto';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(AlertFromAI)
    private alertRepository: Repository<AlertFromAI>,
    @InjectRepository(AlertedBy)
    private alertedByRepository: Repository<AlertedBy>,
    private readonly databaseService: DatabaseService,
  ) {}

  async createAlert(createAlertDto: CreateAlertDto): Promise<AlertFromAI> {
    const alert = this.alertRepository.create(createAlertDto);
    return this.alertRepository.save(alert);
  }

  async findAllAlerts(): Promise<AlertFromAI[]> {
    return this.alertRepository.find({
      relations: ['hadas', 'alertedUsers'],
      order: { alertid: 'DESC' },
    });
  }

  async findAlertById(id: number): Promise<AlertFromAI> {
    const alert = await this.alertRepository.findOne({
      where: { alertid: id },
      relations: ['hadas', 'alertedUsers'],
    });
    if (!alert) {
      throw new NotFoundException(`Alert with id ${id} not found`);
    }
    return alert;
  }

  async updateAlert(
    id: number,
    updateAlertDto: UpdateAlertDto,
  ): Promise<AlertFromAI> {
    const alert = await this.findAlertById(id);
    Object.assign(alert, updateAlertDto);
    return this.alertRepository.save(alert);
  }

  async removeAlert(id: number): Promise<void> {
    const result = await this.alertRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Alert with id ${id} not found`);
    }
  }

  async alertUser(userid: number, alertid: number): Promise<AlertedBy> {
    const existingAlert = await this.alertedByRepository.findOne({
      where: { userid, alertid },
    });
    if (existingAlert) {
      return existingAlert;
    }
    const alertedBy = this.alertedByRepository.create({ userid, alertid });
    return this.alertedByRepository.save(alertedBy);
  }

  async removeAlertForUser(userid: number, alertid: number): Promise<void> {
    const result = await this.alertedByRepository.delete({ userid, alertid });
    if (result.affected === 0) {
      throw new NotFoundException(
        `No alert record found for user ${userid} and alert ${alertid}`,
      );
    }
  }

  async getUserAlerts(userid: number): Promise<AlertedBy[]> {
    return this.alertedByRepository.find({
      where: { userid },
      relations: ['alert'],
      order: { sentat: 'DESC' },
    });
  }

  async getAlertStats(): Promise<{ totalAlerts: number; totalRecipients: number }>
  {
    const alertsResult = await this.databaseService.query<{ total: string }>(
      'SELECT COUNT(*) AS total FROM alertfromai',
    );
    const recipientsResult = await this.databaseService.query<{ total: string }>(
      'SELECT COUNT(*) AS total FROM alertedby',
    );

    return {
      totalAlerts: Number.parseInt(alertsResult.rows[0]?.total ?? '0', 10),
      totalRecipients: Number.parseInt(recipientsResult.rows[0]?.total ?? '0', 10),
    };
  }
}
