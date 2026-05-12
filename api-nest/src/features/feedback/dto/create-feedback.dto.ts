import {
  IsString,
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsOptional,
  IsInt,
} from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType('CreateFeedbackInput')
export class CreateFeedbackDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  @IsNotEmpty()
  rating!: number;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  userid!: number;
}

@InputType('UpdateFeedbackInput')
export class UpdateFeedbackDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  content?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @IsOptional()
  userid?: number;
}