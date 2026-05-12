import { IsString, IsNotEmpty, IsOptional, IsDate } from 'class-validator';
import { Transform } from 'class-transformer';
import { InputType, Field, GraphQLISODateTime } from '@nestjs/graphql';

function toOptionalDate({ value }: { value: unknown }): unknown {
  if (value == null || value === '') return undefined;
  if (value instanceof Date) return value;
  const d = new Date(value as string);
  return Number.isNaN(d.getTime()) ? value : d;
}

@InputType('CreateParticipantDto')
export class CreateParticipantDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  participantname?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Transform(toOptionalDate)
  @IsDate()
  @IsOptional()
  pdateofbirth?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gender?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  participanttype: string;
}

@InputType('UpdateParticipantDto')
export class UpdateParticipantDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  participantname?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @Transform(toOptionalDate)
  @IsDate()
  @IsOptional()
  pdateofbirth?: Date;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  gender?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  participanttype?: string;
}

