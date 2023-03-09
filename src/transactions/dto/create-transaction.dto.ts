import { IsNumber, IsOptional, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class CreateTransactionDto {
  @IsString()
  user: User;

  @IsNumber()
  @IsOptional()
  amount: number;

  @IsNumber()
  @IsOptional()
  charge: number;

  @IsNumber()
  @IsOptional()
  postBalance: number;

  @IsNumber()
  @IsOptional()
  preBalance: number;

  @IsString()
  @IsOptional()
  trx: string;

  @IsString()
  @IsOptional()
  trxType: string;

  @IsString()
  @IsOptional()
  details: string;

  @IsString()
  @IsOptional()
  remark: string;
}
