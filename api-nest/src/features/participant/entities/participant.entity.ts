import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { InvolvedIn } from '../../involvedin/entities/involved-in.entity';
import { pgDateToUtcDateTransformer } from '../../../common/typeorm/pg-date.transformer';

@ObjectType()
@Entity('participant')
export class Participant {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  participantid!: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  participantname!: string;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description!: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Column({
    type: 'date',
    nullable: true,
    transformer: pgDateToUtcDateTransformer,
  })
  pdateofbirth!: Date;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 10, nullable: true })
  gender!: string;

  @Field()
  @Column({ type: 'varchar', length: 30 })
  participanttype!: string;

  @OneToMany(() => InvolvedIn, (involved) => involved.participant)
  reports!: InvolvedIn[];
}
