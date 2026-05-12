import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateAlertedByDto {
  @IsInt()
  @IsNotEmpty()
  userid!: number;

  @IsInt()
  @IsNotEmpty()
  alertid!: number;
}

