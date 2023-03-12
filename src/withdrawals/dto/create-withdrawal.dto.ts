import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWithdrawalDto {
  @IsString()
  user: string;
  @IsNumber()
  amount: number;
  @IsString()
  @IsOptional()
  trxn?: string;
}
