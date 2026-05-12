import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DatabaseService } from '../../config/database.service';
import { CrimeReport } from './entities/crime-report.entity';
import { CreateReportDto, UpdateReportDto } from './dto/create-report.dto';

const VALID_STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(CrimeReport)
    private reportRepository: Repository<CrimeReport>,
    private readonly databaseService: DatabaseService,
  ) {}

  async create(createReportDto: CreateReportDto): Promise<CrimeReport> {
    if (createReportDto.crimedate != null) {
      createReportDto.crimedate = new Date(createReportDto.crimedate);
    }

    const status = createReportDto.status || 'Pending';
    if (!VALID_STATUSES.includes(status)) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      );
    }
    const report = this.reportRepository.create(createReportDto);
    return this.reportRepository.save(report);
  }

  async findAll(): Promise<CrimeReport[]> {
    return this.reportRepository.find({
      relations: ['user', 'region', 'hadas', 'participants'],
      order: { reportid: 'DESC' },
    });
  }

  async findById(id: number): Promise<CrimeReport> {
    const report = await this.reportRepository.findOne({
      where: { reportid: id },
      relations: ['user', 'region', 'hadas', 'participants'],
    });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return report;
  }

  async update(
    id: number,
    updateReportDto: UpdateReportDto,
  ): Promise<CrimeReport> {
    if (updateReportDto.crimedate != null) {
      updateReportDto.crimedate = new Date(updateReportDto.crimedate);
    }
    if (
      updateReportDto.status &&
      !VALID_STATUSES.includes(updateReportDto.status)
    ) {
      throw new BadRequestException(
        `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
      );
    }
    const report = await this.findById(id);
    Object.assign(report, updateReportDto);
    return this.reportRepository.save(report);
  }

  async remove(id: number): Promise<void> {
    const result = await this.reportRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
  }

  async getReportStats(): Promise<{
    total: number;
    byStatus: Record<string, number>;
  }> {
    const totalResult = await this.databaseService.query<{ total: string }>(
      'SELECT COUNT(*) AS total FROM crimereport',
    );
    const statusResult = await this.databaseService.query<{ status: string; total: string }>(
      'SELECT status, COUNT(*) AS total FROM crimereport GROUP BY status',
    );

    const byStatus = statusResult.rows.reduce<Record<string, number>>(
      (acc, row) => {
        acc[row.status] = Number.parseInt(row.total, 10);
        return acc;
      },
      {},
    );

    return {
      total: Number.parseInt(totalResult.rows[0]?.total ?? '0', 10),
      byStatus,
    };
  }

  sanitizeReport(report: CrimeReport): Omit<CrimeReport, 'user'> & {
    user?: { userid: number; username: string; email: string };
  } {
    const { user, ...rest } = report;
    return {
      ...rest,
      user: user
        ? { userid: user.userid, username: user.username, email: user.email }
        : undefined,
    };
  }
}
