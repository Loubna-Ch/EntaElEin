import {
  Entity,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AlertFromAI } from './alert-fromai.entity';

@Entity('alertedby')
export class AlertedBy {
  @PrimaryColumn()
  userid!: number;

  @PrimaryColumn()
  alertid!: number;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  sentat!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userid' })
  user!: User;

  @ManyToOne(() => AlertFromAI, (alert) => alert.alertedUsers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'alertid' })
  alert!: AlertFromAI;
}
