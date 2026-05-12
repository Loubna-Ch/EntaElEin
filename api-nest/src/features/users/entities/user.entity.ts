import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { CrimeReport } from '../../report/entities/crime-report.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Region } from '../../region/entities/region.entity';

export enum UserRole {
  ADMIN = 'admin',
  OFFICER = 'officer',
  CITIZEN = 'citizen',
}

@Entity('User')
@Unique(['email'])
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  userid: number;

  @Column({ type: 'varchar', length: 50 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phonenumber: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'date', nullable: true })
  dateofbirth: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registrationdate: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'citizen',
    enum: UserRole,
  })
  role: UserRole;

  @Column({ nullable: true })
  regionid: number;

  @ManyToOne(() => Region, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'regionid' })
  region: Region;

  @OneToMany(() => CrimeReport, (report) => report.user)
  reports: CrimeReport[];

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];
}
