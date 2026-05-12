import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsInt,
  MaxLength,
} from 'class-validator';
import { InputType, Field, Int } from '@nestjs/graphql';

@InputType('CreateAlertDto')
export class CreateAlertDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  message!: string;

  @Field(() => Int)
  @IsNumber()
  @IsInt()
  @IsNotEmpty()
  hadasid!: number;
}

@InputType('UpdateAlertDto')
export class UpdateAlertDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  message?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsInt()
  @IsOptional()
  hadasid?: number;
}

