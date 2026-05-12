import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateInvolvedInDto {
  @IsInt()
  @IsNotEmpty()
  participantid!: number;

  @IsInt()
  @IsNotEmpty()
  reportid!: number;
}

