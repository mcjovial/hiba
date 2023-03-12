import { IsNumber, IsString } from 'class-validator';

export class SubscribeDto {
  @IsNumber()
  amount: number;
  @IsString()
  plan: string;
}
