import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType('CreateRegionDto')
export class CreateRegionDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  regionname: string;
}

@InputType('UpdateRegionDto')
export class UpdateRegionDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  regionname: string;
}

