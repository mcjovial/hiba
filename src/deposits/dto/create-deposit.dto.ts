import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDepositDto {
  @IsString()
  plan: string;
  @IsString()
  user: string;
  @IsString()
  purpose: string;
  @IsNumber()
  amount: number;
  @IsString()
  @IsOptional()
  trxn?: string;
}
