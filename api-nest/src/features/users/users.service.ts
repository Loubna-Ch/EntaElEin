import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    await this.ensureEmailAvailable(dto.email);
    const email = dto.email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = this.usersRepository.create({
      ...dto,
      email,
      password: hashedPassword,
      role: dto.role ?? UserRole.CITIZEN,
    });
    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:email)', { email: email.trim() })
      .getOne();
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { userid: id } });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    await this.usersRepository.update({ userid: id }, data);
    const updated = await this.findById(id);
    if (!updated) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return updated;
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: [
        'userid',
        'username',
        'email',
        'role',
        'registrationdate',
        'regionid',
      ],
      order: {
        registrationdate: 'DESC',
      },
    });
  }

  sanitizeUser(user: User) {
    const { password: _password, ...safe } = user;
    void _password;
    return safe;
  }

  private async ensureEmailAvailable(email: string) {
    const existing = await this.findByEmail(email);

    if (existing) {
      throw new ConflictException('Email already registered');
    }
  }

}
