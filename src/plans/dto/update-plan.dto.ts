import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { CreatePlanDto } from './create-plan.dto';

export class UpdatePlanDto extends PartialType(CreatePlanDto) {
  @IsString()
  @IsOptional()
  id: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  price: string;

  @IsNumber()
  @IsOptional()
  bv: number;

  @IsNumber()
  @IsOptional()
  coupon: number;

  @IsNumber()
  @IsOptional()
  referralBonus: number;

  @IsNumber()
  @IsOptional()
  treeBonus: number;

  @IsNumber()
  @IsOptional()
  higherReferralBonus: number;

  @IsNumber()
  @IsOptional()
  brandedDiscount: number;

  @IsNumber()
  @IsOptional()
  physicalDiscount: number;
}
