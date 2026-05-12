import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CrimeReport } from '../../report/entities/crime-report.entity';

@ObjectType()
@Entity('region')
export class Region {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  regionid!: number;

  @Field()
  @Column({ type: 'varchar', length: 100 })
  regionname!: string;

  @OneToMany(() => CrimeReport, (report) => report.region)
  reports!: CrimeReport[];
}
