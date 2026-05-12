import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AlertFromAI } from '../../alerts/entities/alert-fromai.entity';

@ObjectType()
@Entity('hadas')
export class Hadas {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  hadasid: number;

  @Field()
  @Column({ type: 'text' })
  hadasdescription: string;

  @OneToMany(() => AlertFromAI, (alert) => alert.hadas)
  alerts: AlertFromAI[];
}
