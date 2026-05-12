import { ObjectType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@ObjectType()
@Entity('feedback')
export class Feedback {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  feedbackid!: number;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 1000, nullable: true })
  content!: string;

  @Field(() => Int)
  @Column({ type: 'int' })
  rating!: number;

  @Field(() => GraphQLISODateTime)
  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  dateposted!: Date;

  @Field(() => Int, { nullable: true })
  @Column({ nullable: true })
  userid!: number;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userid' })
  user!: User;
}
