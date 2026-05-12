import { ObjectType, Field, Int } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Hadas } from '../../hadas/entities/hadas.entity';
import { AlertedBy } from './alerted-by.entity';

@ObjectType()
@Entity('alertfromai')
export class AlertFromAI {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  alertid!: number;

  @Field()
  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Field()
  @Column({ type: 'text' })
  message!: string;

  @Field(() => Int)
  @Column()
  hadasid!: number;

  @ManyToOne(() => Hadas, (hadas) => hadas.alerts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hadasid' })
  hadas!: Hadas;

  @OneToMany(() => AlertedBy, (alertedBy) => alertedBy.alert)
  alertedUsers!: AlertedBy[];
}
