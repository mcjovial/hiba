import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { CreateWithdrawalDto } from './create-withdrawal.dto';

export class UpdateWithdrawalDto extends PartialType(CreateWithdrawalDto) {
  @IsString()
  @IsOptional()
  status?: string;
}
