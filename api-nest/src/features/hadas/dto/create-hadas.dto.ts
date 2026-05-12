import { IsString, IsNotEmpty, MinLength } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType('CreateHadasDto')
export class CreateHadasDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  hadasdescription: string;
}

@InputType('UpdateHadasDto')
export class UpdateHadasDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  hadasdescription: string;
}

