import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsDate,
  IsInt,
  MaxLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { InputType, Field, Int, GraphQLISODateTime } from '@nestjs/graphql';

@InputType('CreateReportInput')
export class CreateReportDto {
  @Field(() => GraphQLISODateTime)
  @Transform(({ value }) => {
    if (value == null || value === '') return value;
    if (value instanceof Date) return value;
    const d = new Date(value as string);
    return Number.isNaN(d.getTime()) ? value : d;
  })
  @IsDate()
  @IsNotEmpty()
  crimedate!: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  crimetime?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  description!: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image_url?: string;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  userid!: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @IsOptional()
  regionid?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @IsOptional()
  hadasid?: number;
}

@InputType('UpdateReportInput')
export class UpdateReportDto {
  @Field(() => GraphQLISODateTime, { nullable: true })
  @Transform(({ value }) => {
    if (value == null || value === '') return undefined;
    if (value instanceof Date) return value;
    const d = new Date(value as string);
    return Number.isNaN(d.getTime()) ? value : d;
  })
  @IsOptional()
  @IsDate()
  crimedate?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  crimetime?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  status?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  image_url?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @IsOptional()
  userid?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @IsOptional()
  regionid?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @IsOptional()
  hadasid?: number;
}
