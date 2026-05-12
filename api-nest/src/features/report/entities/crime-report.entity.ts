import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Region } from '../../region/entities/region.entity';
import { User } from '../../users/entities/user.entity';
import { InvolvedIn } from '../../involvedin/entities/involved-in.entity';
import { Hadas } from '../../hadas/entities/hadas.entity';
import { pgDateToUtcDateTransformer } from '../../../common/typeorm/pg-date.transformer';

@ObjectType()
@Entity('crimereport')
export class CrimeReport {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  reportid!: number;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'date', transformer: pgDateToUtcDateTransformer })
  crimedate!: Date;

  @Field({ nullable: true })
  @Column({ type: 'time without time zone', nullable: true })
  crimetime!: string;

  @Field(() => GraphQLISODateTime)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reportdate!: Date;

  @Field()
  @Column({ type: 'varchar', length: 1000 })
  description!: string;

  @Field()
  @Column({ type: 'varchar', length: 50, default: 'Pending' })
  status!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  image_url!: string;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  userid!: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  regionid!: number;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  hadasid!: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userid' })
  user!: User;

  @ManyToOne(() => Region, { onDelete: 'NO ACTION' })
  @JoinColumn({ name: 'regionid' })
  region!: Region;

  @ManyToOne(() => Hadas, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'hadasid' })
  hadas!: Hadas;

  @OneToMany(() => InvolvedIn, (involved) => involved.report)
  participants!: InvolvedIn[];
}
