import { IsNumber, IsString } from 'class-validator';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsNumber()
  price: string;

  @IsNumber()
  bv: number;

  @IsNumber()
  coupon: number;

  @IsNumber()
  referralBonus: number;

  @IsNumber()
  treeBonus: number;

  @IsNumber()
  higherReferralBonus: number;

  @IsNumber()
  brandedDiscount: number;

  @IsNumber()
  physicalDiscount: number;
}
