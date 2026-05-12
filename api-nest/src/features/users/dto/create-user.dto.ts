import {
  IsEnum,
  IsDateString,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { InputType, Field, Int, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '../entities/user.entity';

registerEnumType(UserRole, {
  name: 'UserRole',
});

@InputType('CreateUserInput')
export class CreateUserDto {
  @Field()
  @IsString()
  @MaxLength(50)
  username!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  @MinLength(6)
  password!: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phonenumber?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dateofbirth?: string;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  regionid?: number;
}


